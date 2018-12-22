import { IMutation } from "automutate";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { FunctionLikeDeclarationWithType, isNodeWithType } from "../../shared/nodeTypes";
import { collectMutationsFromNodes } from "../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../fileMutator";
import { fixIncompleteReturnTypes } from "./returnTypes/fixIncompleteReturnTypes";
import { fixMissingNonNullReturns } from "./returnTypes/fixMissingNonNullReturns";

export const returnTypeMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> =>
    collectMutationsFromNodes(request, isNodeVisitableFunctionLikeDeclaration, visitFunctionWithBody);

const isNodeVisitableFunctionLikeDeclaration = (node: ts.Node): node is FunctionLikeDeclarationWithType =>
    tsutils.isFunctionWithBody(node)
    // If the node has an implicit return type, we don't need to change anything
    && isNodeWithType(node);

const visitFunctionWithBody = (node: FunctionLikeDeclarationWithType, request: FileMutationsRequest): IMutation | undefined => {
    // If we add in missing types, try adding them in here
    if (request.options.fixes.incompleteTypes) {
        return fixIncompleteReturnTypes(request, node);
    }

    // If we otherwise care about strict null types, check if and where we should add !s
    if (request.options.fixes.strictNullChecks) {
        return fixMissingNonNullReturns(request, node);
    }

    return undefined;
};
