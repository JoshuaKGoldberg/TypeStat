import { Mutation } from "automutate";
import ts from "typescript";

import { createTypeRemovalMutation } from "../../../../mutations/removals.js";
import { declaredInitializedTypeNodeIsRedundant } from "../../../../shared/comparisons.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import { NodeWithType, isNodeWithType } from "../../../../shared/nodeTypes.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";

type InferableVariableDeclaration = ts.VariableDeclaration &
	NodeWithType &
	Required<Pick<ts.VariableDeclaration, "initializer">> & {
		parent: ts.VariableDeclarationList;
	};

export const fixNoInferableTypesVariableDeclarations: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] =>
	collectMutationsFromNodes(
		request,
		isInferableTypeCapableVariableDeclaration,
		getNoInferableTypeVariableDeclarationMutation,
	);

const isInferableTypeCapableVariableDeclaration = (
	node: ts.Node,
): node is InferableVariableDeclaration =>
	ts.isVariableDeclaration(node) &&
	isNodeWithType(node) &&
	node.initializer !== undefined &&
	ts.isVariableDeclarationList(node.parent);

const getNoInferableTypeVariableDeclarationMutation = (
	node: InferableVariableDeclaration,
	request: FileMutationsRequest,
) => {
	if (
		declaredInitializedTypeNodeIsRedundant(request, node.type, node.initializer)
	) {
		return createTypeRemovalMutation(request, node);
	}

	return undefined;
};
