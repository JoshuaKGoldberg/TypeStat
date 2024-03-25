import { Mutation } from "automutate";
import * as tsutils from "ts-api-utils";
import ts from "typescript";

import { createTypeAdditionMutation } from "../../../../mutations/creators.js";
import { isNotUndefined } from "../../../../shared/arrays.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import {
	FunctionLikeDeclarationWithType,
	isNodeWithType,
} from "../../../../shared/nodeTypes.js";
import { getTypeAtLocationIfNotError } from "../../../../shared/types.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";
import { collectReturningNodeExpressions } from "../../fixStrictNonNullAssertions/fixStrictNonNullAssertionReturnTypes/collectReturningNodeExpressions.js";

export const fixIncompleteReturnTypes: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] =>
	collectMutationsFromNodes(
		request,
		isNodeVisitableFunctionLikeDeclaration,
		visitFunctionWithBody,
	);

const isNodeVisitableFunctionLikeDeclaration = (
	node: ts.Node,
): node is FunctionLikeDeclarationWithType =>
	ts.isFunctionLike(node) &&
	// If the node has an implicit return type, we don't need to change anything
	isNodeWithType(node);

const visitFunctionWithBody = (
	node: FunctionLikeDeclarationWithType,
	request: FileMutationsRequest,
) => {
	// Collect the type initially declared as returned
	const declaredType = getTypeAtLocationIfNotError(request, node.type);
	if (
		declaredType === undefined ||
		tsutils.isTypeFlagSet(declaredType, ts.TypeFlags.Any)
	) {
		return undefined;
	}

	// Collect types of nodes returned by the function
	const returnedTypes = collectReturningNodeExpressions(node)
		.map((node) => getTypeAtLocationIfNotError(request, node))
		.filter(isNotUndefined);

	// Add later-returned types to the node's type declaration if necessary
	return createTypeAdditionMutation(request, node, declaredType, returnedTypes);
};
