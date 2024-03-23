import { Mutation } from "automutate";
import ts from "typescript";

import { joinAssignedTypesByName } from "../../../../mutations/assignments.js";
import { createTypeExpansionMutation } from "../../../../mutations/expansions/expansionMutations.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import { getTypeAtLocationIfNotError } from "../../../../shared/types.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";
import {
	InterfaceOrTypeLiteral,
	collectGenericNodeReferences,
} from "./collectGenericNodeReferences.js";
import { expandValuesAssignedToReferenceNodes } from "./expandValuesAssignedToReferenceNodes.js";

export const fixIncompleteInterfaceOrTypeLiteralGenerics: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] =>
	collectMutationsFromNodes(
		request,
		isInterfaceOrTypeLiteral,
		visitInterfaceOrTypeLiteral,
	);

const isInterfaceOrTypeLiteral = (
	node: ts.Node,
): node is InterfaceOrTypeLiteral =>
	ts.isInterfaceDeclaration(node) || ts.isTypeLiteralNode(node);

const visitInterfaceOrTypeLiteral = (
	node: InterfaceOrTypeLiteral,
	request: FileMutationsRequest,
): Mutation | undefined => {
	// Find all nodes that seem like they could possibly reference the generic
	const genericReferenceNodes = collectGenericNodeReferences(request, node);
	if (genericReferenceNodes === undefined) {
		return undefined;
	}

	// Given all those generic references, find all the types being assigned to those nodes
	const originalType = getTypeAtLocationIfNotError(request, node);
	if (originalType === undefined) {
		return undefined;
	}

	const valuesAssignedToReferenceNodes = expandValuesAssignedToReferenceNodes(
		request,
		originalType,
		genericReferenceNodes,
	);
	if (valuesAssignedToReferenceNodes.length === 0) {
		return undefined;
	}

	// Join those types into a mapping that keys them by property name
	// That mapping is directly translatable into a mutation to add those properties
	return createTypeExpansionMutation(request, node, [
		joinAssignedTypesByName(request, valuesAssignedToReferenceNodes),
	]);
};
