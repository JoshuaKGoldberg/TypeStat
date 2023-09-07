import * as ts from "typescript";

/**
 * Finds any nodes returned by a function-like.
 *
 * @param functionLikeDeclaration   Returning function-like declaration.
 * @returns Expression nodes returned from the function-like.
 */
export const collectReturningNodeExpressions = (functionLikeDeclaration: ts.FunctionLikeDeclaration): ReadonlyArray<ts.Expression> => {
    const returnedTypes: ts.Expression[] = [];

    // Search through nodes within the function-like to find all its return statements
    const visitNode = (node: ts.Node): void => {
        // Don't look at returns within a nested function-like signature: they return for that function
        if (ts.isFunctionLike(node)) {
            return;
        }

        // Add new returning nodes as needed when we find any 'return' statement with a value (expression) returned
        if (ts.isReturnStatement(node) && node.expression !== undefined) {
            returnedTypes.push(node.expression);
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(functionLikeDeclaration, visitNode);

    return returnedTypes;
};
