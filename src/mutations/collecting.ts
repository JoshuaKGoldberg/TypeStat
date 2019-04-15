import * as tsutils from "tsutils";
import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { setSubtract } from "../shared/sets";

import { getApplicableTypeAliases } from "./aliasing";
import { findMissingFlags, isTypeFlagSetRecursively } from "./collecting/flags";

/**
 * Collects assigned and missing flags and types, recursively accounting for type unions.
 *
 * @param request   Metadata and settings to collect mutations in a file.
 * @param declaredType   Original type declared on a node.
 * @param allAssignedTypes   All types immediately or later assigned to the node.
 */
export const collectUsageFlagsAndSymbols = (
    request: FileMutationsRequest,
    declaredType: ts.Type,
    allAssignedTypes: ReadonlyArray<ts.Type>,
) => {
    // Collect which flags and types are declared (as a type annotation)...
    const [declaredFlags, declaredTypes] = collectFlagsAndTypesFromTypes(request, declaredType);

    // ...and which are later assigned
    const [assignedFlags, assignedTypes] = collectFlagsAndTypesFromTypes(request, ...allAssignedTypes);

    // Subtract the above to find any flags or types assigned but not declared
    return {
        assignedFlags,
        assignedTypes,
        missingFlags: findMissingFlags(declaredType, assignedFlags, declaredFlags),
        missingTypes: findMissingTypes(request, assignedTypes, declaredTypes),
    };
};

/**
 * Separates raw type node(s) into their contained flags and types.
 *
 * @param options   Source file, metadata, and settings to collect mutations in the file.
 * @param allTypes   Any number of raw type nodes.
 * @returns Flags and types found within the raw type nodes.
 */
export const collectFlagsAndTypesFromTypes = (
    request: FileMutationsRequest,
    ...allTypes: ts.Type[]
): [ReadonlySet<ts.TypeFlags>, ReadonlySet<ts.Type>] => {
    const foundFlags = new Set<ts.TypeFlags>();
    const foundTypes = new Set<ts.Type>();
    const applicableTypeAliases = getApplicableTypeAliases(request);

    // Scan each type for undeclared type additions
    for (const type of allTypes) {
        // For any simple type flag we later will care about for aliasing, add it if it's in the type
        for (const [typeFlag] of applicableTypeAliases) {
            if (isTypeFlagSetRecursively(type, typeFlag)) {
                foundFlags.add(typeFlag);
            }
        }

        // If the type is a rich type (has a symbol), add it in directly
        if (type.getSymbol() !== undefined) {
            foundTypes.add(type);
            continue;
        }

        // If the type is a union, add any flags or types found within it
        if ("types" in type) {
            const subTypes = recursivelyCollectSubTypes(type);
            const [subFlags, deepSubTypes] = collectFlagsAndTypesFromTypes(request, ...subTypes);

            for (const subFlag of subFlags) {
                foundFlags.add(subFlag);
            }

            for (const deepSubType of deepSubTypes) {
                foundTypes.add(deepSubType);
            }
        }
    }

    return [foundFlags, foundTypes];
};

const recursivelyCollectSubTypes = (type: ts.UnionType): ts.Type[] => {
    const subTypes: ts.Type[] = [];

    for (const subType of type.types) {
        if (tsutils.isUnionType(subType)) {
            subTypes.push(...recursivelyCollectSubTypes(subType));
        } else {
            subTypes.push(subType);
        }
    }

    return subTypes;
};

const findMissingTypes = (
    request: FileMutationsRequest,
    assignedTypes: ReadonlySet<ts.Type>,
    declaredTypes: ReadonlySet<ts.Type>,
): ReadonlySet<ts.Type> => {
    // If anything is of type `any`, then bail out immediately: we have no idea what's missing
    for (const type of [...assignedTypes, ...declaredTypes]) {
        if (isTypeFlagSetRecursively(type, ts.TypeFlags.Any)) {
            return new Set();
        }
    }

    const remainingMissingTypes = new Set(assignedTypes);

    const isAssignedTypeMissingFromDeclared = (assignedType: ts.Type) => {
        for (const potentialParentType of declaredTypes) {
            if (request.services.program.getTypeChecker().isTypeAssignableTo(assignedType, potentialParentType)) {
                return false;
            }
        }

        return true;
    };

    for (const assignedType of assignedTypes) {
        if (!isAssignedTypeMissingFromDeclared(assignedType)) {
            remainingMissingTypes.delete(assignedType);
        }
    }

    return setSubtract(remainingMissingTypes, declaredTypes);
};
