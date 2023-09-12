import { Mutation } from "automutate";
import * as ts from "typescript";

import { createTypeRemovalMutation } from "../../../../mutations/removals.js";
import { declaredInitializedTypeNodeIsRedundant } from "../../../../shared/comparisons.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import {
	ParameterDeclarationWithType,
	isNodeWithType,
} from "../../../../shared/nodeTypes.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";

export const fixNoInferableTypesParameters: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] =>
	collectMutationsFromNodes(
		request,
		isInferableTypeCapableParameter,
		getNoInferableTypeParameterMutation,
	);

const isInferableTypeCapableParameter = (
	node: ts.Node,
): node is ParameterDeclarationWithType =>
	ts.isParameter(node) && isNodeWithType(node) && node.modifiers === undefined;

const getNoInferableTypeParameterMutation = (
	node: ParameterDeclarationWithType,
	request: FileMutationsRequest,
) => {
	if (!parameterTypeIsInferable(request, node)) {
		return undefined;
	}

	return createTypeRemovalMutation(request, node);
};

const parameterTypeIsInferable = (
	request: FileMutationsRequest,
	node: ParameterDeclarationWithType,
): node is ParameterDeclarationWithType => {
	// If the parameter has an initializer (default value), that might invalidate its type
	if (node.initializer) {
		if (
			declaredInitializedTypeNodeIsRedundant(
				request,
				node.type,
				node.initializer,
			)
		) {
			return true;
		}
	}

	// Eventually, it'd be nice to check for parameters whose values are inferable from
	// their parent function's declarations, e.g.
	// ```ts
	// type TakesString = (input: string) => void;
	// const takesString: TakesString = (input: string) => {};
	// ```
	// See https://github.com/microsoft/TypeScript/issues/35691

	return false;
};
