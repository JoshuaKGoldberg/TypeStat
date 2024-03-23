import { Mutation } from "automutate";
import ts from "typescript";

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

export const fixNoImplicitAnyParameters: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] =>
	collectMutationsFromNodes(
		request,
		isNodeNoImplicitAnyFixableParameter,
		getNoImplicitAnyMutations,
	);

const isNodeNoImplicitAnyFixableParameter = (
	node: ts.Node,
): node is ts.ParameterDeclaration & NoImplicitAnyNodeToBeFixed =>
	ts.isParameter(node) && canNodeBeFixedForNoImplicitAny(node);
