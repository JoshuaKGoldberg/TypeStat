import * as tsutils from "tsutils";
import * as ts from "typescript";

/**
 * Checks if a type contains a type flag, accounting for deep nested type unions.
 * 
 * @param parentType   Parent type to check for the type flag.
 * @param typeFlag   Type flag to check within the parent type.
 * @returns Whether the parent type contains the type flag.
 */
export const isTypeFlagSetRecursively = (parentType: ts.Type, typeFlag: ts.TypeFlags): boolean => {
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
};

export const joinIntoType = (
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
