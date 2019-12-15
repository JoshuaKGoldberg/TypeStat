import * as ts from "typescript";
import * as tsutils from "tsutils";
import { getValueDeclarationOfType } from "./nodeTypes";

/**
 * @returns Declared type of a function-like expression.
 */
export const getValueDeclarationOfFunction = (typeChecker: ts.TypeChecker, node: ts.Expression) => {
    const functionLikeValueDeclaration = getValueDeclarationOfType(typeChecker, node);
    if (functionLikeValueDeclaration === undefined || !tsutils.isFunctionWithBody(functionLikeValueDeclaration)) {
        return undefined;
    }

    return functionLikeValueDeclaration;
};
