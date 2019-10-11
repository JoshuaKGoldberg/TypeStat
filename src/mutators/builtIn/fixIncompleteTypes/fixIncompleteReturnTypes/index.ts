import { IMutation } from "automutate";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { createTypeAdditionMutation } from "../../../../mutations/creators";
import { FunctionLikeDeclarationWithType, isNodeWithType } from "../../../../shared/nodeTypes";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";
import { collectReturningNodeExpressions } from "../../fixStrictNonNullAssertions/fixStrictNonNullAssertionReturnTypes/collectReturningNodeExpressions";

export const fixIncompleteReturnTypes: FileMutator = (request: FileMutationsRequest): readonly IMutation[] =>
    collectMutationsFromNodes(request, isNodeVisitableFunctionLikeDeclaration, visitFunctionWithBody);

const isNodeVisitableFunctionLikeDeclaration = (node: ts.Node): node is FunctionLikeDeclarationWithType =>
        tsutils.isFunctionWithBody(node) &&
        // If the node has an implicit return type, we don't need to change anything
        isNodeWithType(node),
    visitFunctionWithBody = (node: FunctionLikeDeclarationWithType, request: FileMutationsRequest) => {
        // Collect the type initially declared as returned
        const declaredType = request.services.program.getTypeChecker().getTypeAtLocation(node.type),
            // Collect types of nodes returned by the function
            returnedTypes = collectReturningNodeExpressions(node).map(request.services.program.getTypeChecker().getTypeAtLocation);

        // Add later-returned types to the node's type declaration if necessary
        return createTypeAdditionMutation(request, node, declaredType, returnedTypes);
    };
