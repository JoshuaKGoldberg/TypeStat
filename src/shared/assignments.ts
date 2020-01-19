import * as ts from "typescript";
import { getValueDeclarationOfFunction } from "./functionTypes";

/**
 * Given a node passed to a location with a declared, known type,
 * attempts to find that known type.
 *
 * @example
 * If the node is assigned to a variable, this would return that variable's type.
 * In this case, that would be `Record<string, string>`:
 *
 * ```ts
 * const value: Record<string, string> = {};
 *                                    // ^^
 * ```
 *
 * @example
 * If the node passed to a function, this would return that variable's type.
 * In this case, that would be `number | null`:
 *
 * ```ts
 * function receivesNumber(value: number | null) { }
 * receivesNumber(3);
 *             // ^
 * ```
 */
export const getManuallyAssignedTypeOfNode = (typeChecker: ts.TypeChecker, node: ts.Node) => {
    const { parent } = node;

    if (ts.isCallExpression(parent)) {
        return getAssignedTypeOfParameter(typeChecker, node as ts.Expression, parent);
    }

    if (ts.isVariableDeclaration(parent)) {
        return getAssignedTypeOfVariable(typeChecker, parent);
    }

    return undefined;
};

const getAssignedTypeOfParameter = (typeChecker: ts.TypeChecker, node: ts.Expression, parent: ts.CallExpression) => {
    // Collect the declared type of the function-like being called
    const functionLikeValueDeclaration = getValueDeclarationOfFunction(typeChecker, parent.expression);
    if (functionLikeValueDeclaration === undefined) {
        return undefined;
    }

    // Don't bother checking for an out-of-range parameter
    const argumentIndex = parent.arguments.indexOf(node);
    if (argumentIndex >= functionLikeValueDeclaration.parameters.length) {
        return undefined;
    }

    return typeChecker.getTypeAtLocation(functionLikeValueDeclaration.parameters[argumentIndex]);
};

const getAssignedTypeOfVariable = (typeChecker: ts.TypeChecker, node: ts.VariableDeclaration) => {
    if (node.type === undefined) {
        return undefined;
    }

    return typeChecker.getTypeFromTypeNode(node.type);
};
