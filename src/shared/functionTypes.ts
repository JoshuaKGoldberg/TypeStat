import * as ts from "typescript";
import * as tsutils from "tsutils";

import { FileMutationsRequest } from "./fileMutator";
import { getValueDeclarationOfType } from "./nodeTypes";

/**
 * @returns Declared type of a function-like expression.
 */
export const getValueDeclarationOfFunction = (request: FileMutationsRequest, node: ts.Expression) => {
    const functionLikeValueDeclaration = getValueDeclarationOfType(request, node);
    if (functionLikeValueDeclaration === undefined || !tsutils.isFunctionWithBody(functionLikeValueDeclaration)) {
        return undefined;
    }

    return functionLikeValueDeclaration;
};
