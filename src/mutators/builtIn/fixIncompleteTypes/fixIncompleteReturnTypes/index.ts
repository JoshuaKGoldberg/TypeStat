import { Mutation } from "automutate";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { createTypeAdditionMutation } from "../../../../mutations/creators";
import { isNotUndefined } from "../../../../shared/arrays";
import { FunctionLikeDeclarationWithType, isNodeWithType } from "../../../../shared/nodeTypes";
import { getTypeAtLocationIfNotError } from "../../../../shared/types";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";
import { collectReturningNodeExpressions } from "../../fixStrictNonNullAssertions/fixStrictNonNullAssertionReturnTypes/collectReturningNodeExpressions";

export const fixIncompleteReturnTypes: FileMutator = (request: FileMutationsRequest): ReadonlyArray<Mutation> =>
    collectMutationsFromNodes(request, isNodeVisitableFunctionLikeDeclaration, visitFunctionWithBody);

const isNodeVisitableFunctionLikeDeclaration = (node: ts.Node): node is FunctionLikeDeclarationWithType =>
    tsutils.isFunctionWithBody(node) &&
    // If the node has an implicit return type, we don't need to change anything
    isNodeWithType(node);

const visitFunctionWithBody = (node: FunctionLikeDeclarationWithType, request: FileMutationsRequest) => {
    // Collect the type initially declared as returned
    const declaredType = getTypeAtLocationIfNotError(request, node.type);
    if (declaredType === undefined || tsutils.isTypeFlagSet(declaredType, ts.TypeFlags.Any)) {
        return undefined;
    }

    // Collect types of nodes returned by the function
    const returnedTypes = collectReturningNodeExpressions(node)
        .map((node) => getTypeAtLocationIfNotError(request, node))
        .filter(isNotUndefined);

    // Add later-returned types to the node's type declaration if necessary
    return createTypeAdditionMutation(request, node, declaredType, returnedTypes);
};
