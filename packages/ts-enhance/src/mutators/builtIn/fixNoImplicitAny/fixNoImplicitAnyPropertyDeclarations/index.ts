import { Mutation } from "automutate";
import * as ts from "typescript";

import {
	NoImplicitAnyNodeToBeFixed,
	canNodeBeFixedForNoImplicitAny,
	getNoImplicitAnyMutations,
} from "../../../../mutations/codeFixes/noImplicitAny.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";

export const fixNoImplicitAnyPropertyDeclarations: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] =>
	collectMutationsFromNodes(
		request,
		isNodeNoImplicitAnyFixablePropertyDeclaration,
		getNoImplicitAnyMutations,
	);

const isNodeNoImplicitAnyFixablePropertyDeclaration = (
	node: ts.Node,
): node is ts.PropertyDeclaration & NoImplicitAnyNodeToBeFixed =>
	ts.isPropertyDeclaration(node) && canNodeBeFixedForNoImplicitAny(node);
