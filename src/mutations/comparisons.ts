import * as tsutils from "tsutils";
import * as ts from "typescript";
import { FileMutationsRequest } from "../mutators/fileMutator";

export const typeIsChildOf = (
    request: FileMutationsRequest,
    child: ts.Type,
    potentialParent: ts.Type,
): boolean => {
    if (areTypesWithSymbolsRoughlyEqual(child, potentialParent)) {
        return true;
    }

    if (!tsutils.isInterfaceType(child) || !tsutils.isInterfaceType(potentialParent)) {
        return false;
    }

    if (child.getSymbol() !== undefined && child.getSymbol() === potentialParent.getSymbol()) {
        return true;
    }

    const typeChecker = request.services.program.getTypeChecker();
    const childBaseTypes = typeChecker.getBaseTypes(child);

    for (const baseType of childBaseTypes) {
        if (tsutils.isInterfaceType(baseType)) {
            if (typeIsChildOf(request, baseType, potentialParent)) {
                return true;
            }
        }

        if (tsutils.isUnionType(baseType)) {
            for (const type of baseType.types) {
                if (typeIsChildOf(request, type, potentialParent)) {
                    return true;
                }
            }
        }
    }

    return false;
};

/**
 * Checks whether two rich types seem to be roughly the same.
 *
 * This will crash if either type doesn't have a .symbol.
 * Only use it for types known to be interfaces or classes, not primitives!
 */
export const areTypesWithSymbolsRoughlyEqual = (a: ts.Type, b: ts.Type) => {
    return a.flags === b.flags && a.symbol.name === b.symbol.name;
};
