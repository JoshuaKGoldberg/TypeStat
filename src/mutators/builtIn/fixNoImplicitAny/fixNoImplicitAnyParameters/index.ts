import { Mutation } from "automutate";
import ts from "typescript";

import {
	canNodeBeFixedForNoImplicitAny,
	getNoImplicitAnyMutations,
	NoImplicitAnyNodeToBeFixed,
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
): node is NoImplicitAnyNodeToBeFixed & ts.ParameterDeclaration =>
	ts.isParameter(node) && canNodeBeFixedForNoImplicitAny(node);
