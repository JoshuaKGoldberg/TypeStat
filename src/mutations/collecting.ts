import * as tsutils from "tsutils";
import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { TypeStatOptions } from "../options/types";
import { setSubtract } from "../shared/sets";
import { getApplicableTypeAliases } from "./aliasing";
import { findMissingFlags, isTypeFlagSetRecursively } from "./collecting/flags";
import { areTypesRoughlyEqual, typeIsChildOf } from "./comparisons";

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
    const [declaredFlags, declaredTypes] = collectFlagsAndTypesFromTypes(request.options, declaredType);

    // ...and which are later assigned
    const [assignedFlags, assignedTypes] = collectFlagsAndTypesFromTypes(request.options, ...allAssignedTypes);

    // Subtract the above to find any flags or types assigned but not declared
    return {
        assignedFlags,
        assignedTypes,
        missingFlags: findMissingFlags(declaredType, assignedFlags, declaredFlags),
        missingTypes: findMissingTypes(request, assignedTypes, declaredTypes),
    };
};

/**
 * Separates raw type nodes into their contained flags and types.
 *
 * @param options   Parsed runtime options for TypeStat.
 * @param allTypes   Any number of raw type nodes.
 * @returns Flags and types found within the raw type nodes.
 */
const collectFlagsAndTypesFromTypes = (
    options: TypeStatOptions,
    ...allTypes: ts.Type[]
): [ReadonlySet<ts.TypeFlags>, ReadonlySet<ts.Type>] => {
    const foundFlags = new Set<ts.TypeFlags>();
    const foundTypes = new Set<ts.Type>();
    const applicableTypeAliases = getApplicableTypeAliases(options);

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
            const [subFlags, deepSubTypes] = collectFlagsAndTypesFromTypes(options, ...subTypes);

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

    const rootLevelAssignedTypes = new Set(assignedTypes);

    const shouldRemoveAssignedType = (assignedType: ts.Type) => {
        for (const potentialParentType of [...assignedTypes, ...declaredTypes]) {
            if (assignedType === potentialParentType) {
                continue;
            }

            if (
                areTypesRoughlyEqual(request, assignedType, potentialParentType) ||
                typeIsChildOf(request, assignedType, potentialParentType)
            ) {
                return true;
            }
        }

        return false;
    };

    for (const assignedType of assignedTypes) {
        if (shouldRemoveAssignedType(assignedType)) {
            rootLevelAssignedTypes.delete(assignedType);
        }
    }

    return setSubtract(rootLevelAssignedTypes, declaredTypes);
};
