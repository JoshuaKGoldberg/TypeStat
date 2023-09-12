import { Mutation } from "automutate";
import * as ts from "typescript";

import {
	canNodeBeFixedForNoImplicitAny,
	getNoImplicitAnyMutations,
} from "../../../../mutations/codeFixes/noImplicitAny.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";

export const fixNoImplicitAnyVariableDeclarations: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] => {
	// This mutator fixes only for --noImplicitAny
	if (!request.options.fixes.noImplicitAny) {
		return [];
	}

	return collectMutationsFromNodes(
		request,
		isNodeVisitableVariableDeclaration,
		visitVariableDeclaration,
	);
};

const isNodeVisitableVariableDeclaration = (
	node: ts.Node,
): node is ts.VariableDeclaration =>
	ts.isVariableDeclaration(node) &&
	!node.type &&
	// Binding patterns are all implicitly typed, so ignore them
	!(
		ts.isArrayBindingPattern(node.name) || ts.isObjectBindingPattern(node.name)
	) &&
	// For-in and for-of loop variables cannot have types, so don't bother trying to add them
	!ts.isForInStatement(node.parent.parent) &&
	!ts.isForOfStatement(node.parent.parent);

const visitVariableDeclaration = (
	node: ts.VariableDeclaration,
	request: FileMutationsRequest,
): Mutation | undefined => {
	// If the variable violates --noImplicitAny (has no type or initializer), this can only be a --noImplicitAny fix
	if (canNodeBeFixedForNoImplicitAny(node)) {
		return getNoImplicitAnyMutations(node, request);
	}

	return undefined;
};
