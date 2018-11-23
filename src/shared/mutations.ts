import { ITextInsertMutation } from "automutate";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { setSubtract } from "./sets";

/**
 * Type flags we're willing to print into types, keyed to their type aliases.
 */
const knownTypeFlagsWithNames = new Map([
    [ts.TypeFlags.Boolean, "boolean"],
    [ts.TypeFlags.BooleanLiteral, "boolean"],
    [ts.TypeFlags.Null, "null"],
    [ts.TypeFlags.Number, "number"],
    [ts.TypeFlags.NumberLiteral, "number"],
    [ts.TypeFlags.String, "string"],
    [ts.TypeFlags.StringLiteral, "string"],
    [ts.TypeFlags.Undefined, "undefined"],
]);

/**
 * Creates a mutation to add types to an existing type, if any are new.
 * 
 * @param typeNode   Original type declaration node.
 * @param declaredType   Declared type from the node.
 * @param assignedTypes   Types now assigned to the node.
 * @returns Mutation to add any new assigned types, if any are missing from the declared type.
 */
export const createTypeAdditionMutation = (
    typeNode: ts.TypeNode,
    declaredType: ts.Type,
    assignedTypes: ReadonlyArray<ts.Type>,
    typeAliases: ReadonlyMap<string, string>,
): ITextInsertMutation | undefined => {
    const { missingFlags, missingSymbols } = collectUsageFlagsAndSymbols(declaredType, assignedTypes);

    // If nothing is missing, rejoice! The type was already fine.
    if (missingFlags.size === 0 && missingSymbols.size === 0) {
        return undefined;
    }

    // Create a mutation insertion that adds the missing types in
    return {
        insertion: ` | ${joinIntoType(missingFlags, missingSymbols, typeAliases)}`,
        range: {
            begin: typeNode.end,
        },
        type: "text-insert",
    }
};

/**
 * Creates a mutation to add types to a node without a type, if any are new.
 * 
 * @param node   Original node with its own type.
 * @param declaredType   Declared type from the node.
 * @param assignedTypes   Types now assigned to the node.
 * @returns Mutation to add any new assigned types, if any are missing from the declared type.
 */
export const createTypeCreationMutation = (
    begin: number,
    declaredType: ts.Type,
    assignedTypes: ReadonlyArray<ts.Type>,
    typeAliases: ReadonlyMap<string, string>,
): ITextInsertMutation | undefined => {
    const { assignedFlags, assignedSymbols, missingFlags, missingSymbols } = collectUsageFlagsAndSymbols(declaredType, assignedTypes);

    // If nothing is missing, rejoice! The type was already fine.
    if (missingFlags.size === 0 && missingSymbols.size === 0) {
        return undefined;
    }

    // Create a mutation insertion that adds the assigned types in
    return {
        insertion: `: ${joinIntoType(assignedFlags, assignedSymbols, typeAliases)}`,
        range: {
            begin,
        },
        type: "text-insert",
    }
};

const collectUsageFlagsAndSymbols = (declaredType: ts.Type, assignedTypes: ReadonlyArray<ts.Type>) => {
    const [declaredFlags, declaredSymbols] = collectFlagsAndSymbolsFromType(declaredType);
    const [assignedFlags, assignedSymbols] = collectFlagsAndSymbolsFromType(...assignedTypes);

    const missingFlags = setSubtract(assignedFlags, declaredFlags);
    const missingSymbols = setSubtract(assignedSymbols, declaredSymbols);

    return { assignedFlags, assignedSymbols, missingFlags, missingSymbols };
};

const collectFlagsAndSymbolsFromType = (...assignedTypes: ts.Type[]): [ReadonlySet<string>, ReadonlySet<ts.Symbol>] => {
    const assignedFlags = new Set<string>();
    const assignedSymbols = new Set<ts.Symbol>();

    // Scan each assigned type for undeclared type additions
    for (const assignedType of assignedTypes) {
        // For any simple type flag, add its alias if it's in the assigned type but not the declared type
        for (const [typeFlag, alias] of knownTypeFlagsWithNames) {
            if (isTypeFlagSetRecursively(assignedType, typeFlag)) {
                assignedFlags.add(alias);
            }
        }

        // Add any assigned symbols (complex types)
        const assigningSymbol = assignedType.getSymbol();
        if (assigningSymbol !== undefined) {
            assignedSymbols.add(assigningSymbol);
        }
    }

    return [assignedFlags, assignedSymbols];
};

/**
 * Checks if a type contains a type flag, accounting for deep nested type unions.
 * 
 * @param parentType   Parent type to check for the type flag.
 * @param typeFlag   Type flag to check within the parent type.
 * @returns Whether the parent type contains the type flag.
 */
const isTypeFlagSetRecursively = (parentType: ts.Type, typeFlag: ts.TypeFlags): boolean => {
    if (tsutils.isTypeFlagSet(parentType, typeFlag)) {
        return true;
    }

    if (tsutils.isUnionOrIntersectionType(parentType)) {
        for (const childType of parentType.types) {
            if (isTypeFlagSetRecursively(childType, typeFlag)) {
                return true;
            }
        }
    }

    return false;
}

const joinIntoType = (
    assignedFlags: ReadonlySet<string>,
    assignedSymbols: ReadonlySet<ts.Symbol>,
    typeAliases: ReadonlyMap<string, string>,
) => {
    const typeNames = [
        ...Array.from(assignedSymbols).map(missingSymbol => missingSymbol.name),
        ...assignedFlags,
    ];
    
    return typeNames
        .map(type => {
            const alias = typeAliases.get(type);

            return alias === undefined
                ? type
                : alias;
        })
        .join(" | ");
};
