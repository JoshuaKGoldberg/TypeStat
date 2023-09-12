import { Mutation } from "automutate";
import * as ts from "typescript";

import { createTypeRemovalMutation } from "../../../../mutations/removals.js";
import { declaredInitializedTypeNodeIsRedundant } from "../../../../shared/comparisons.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import { NodeWithType, isNodeWithType } from "../../../../shared/nodeTypes.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";

type InferablePropertyDeclaration = ts.PropertyDeclaration &
	NodeWithType &
	Required<Pick<ts.PropertyDeclaration, "initializer">>;

export const fixNoInferableTypesPropertyDeclarations: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] =>
	collectMutationsFromNodes(
		request,
		isInferableTypeCapablePropertyDeclaration,
		getNoInferableTypePropertyDeclarationMutation,
	);

const isInferableTypeCapablePropertyDeclaration = (
	node: ts.Node,
): node is InferablePropertyDeclaration =>
	ts.isPropertyDeclaration(node) &&
	isNodeWithType(node) &&
	node.initializer !== undefined;

const getNoInferableTypePropertyDeclarationMutation = (
	node: InferablePropertyDeclaration,
	request: FileMutationsRequest,
) => {
	if (
		!declaredInitializedTypeNodeIsRedundant(
			request,
			node.type,
			node.initializer,
		)
	) {
		return undefined;
	}

	return createTypeRemovalMutation(request, node);
};
