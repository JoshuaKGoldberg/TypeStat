import ts from "typescript";

import { getNoImplicitThisMutations } from "../../../mutations/codeFixes/noImplicitThis.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../shared/fileMutator.js";
import { collectMutationsFromNodes } from "../../collectMutationsFromNodes.js";

export const fixNoImplicitThis: FileMutator = (
	request: FileMutationsRequest,
) =>
	request.options.fixes.noImplicitThis
		? collectMutationsFromNodes(
				request,
				isThisExpression,
				getNoImplicitThisMutations,
			)
		: undefined;

const isThisExpression = (node: ts.Node): node is ts.ThisExpression =>
	node.kind === ts.SyntaxKind.ThisKeyword;
