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
    tsutils.isFunctionWithBody(node) &&
    // If the node has an implicit return type, we don't need to change anything
    isNodeWithType(node);

const visitFunctionWithBody = (node: FunctionLikeDeclarationWithType, request: FileMutationsRequest): IMutation | undefined => {
    // If we add in missing types to function-like return declarations, try adding them in here
    if (request.options.fixes.incompleteTypes) {
        const incompleteReturnFixes = fixIncompleteReturnTypes(request, node);

        if (incompleteReturnFixes !== undefined) {
            return incompleteReturnFixes;
        }
    }

    // If we otherwise add non null assertions on returns, check if and where we should add !s on returns
    if (request.options.fixes.strictNonNullAssertions) {
        const nonNullReturnFixes = fixMissingNonNullReturns(request, node);

        if (nonNullReturnFixes !== undefined) {
            return nonNullReturnFixes;
        }
    }

    return undefined;
};
