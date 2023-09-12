import { Mutation } from "automutate";
import { EOL } from "node:os";
import * as ts from "typescript";
import { getQuickErrorSummary } from "typestat-utils";

import { FileMutationsRequest } from "../shared/fileMutator.js";
import { NodeSelector } from "../shared/nodeTypes.js";

export type NodeVisitor<TNode extends ts.Node> = (
	node: TNode,
	request: FileMutationsRequest,
) => Readonly<Mutation> | undefined;

export const collectMutationsFromNodes = <TNode extends ts.Node>(
	request: FileMutationsRequest,
	selector: NodeSelector<TNode>,
	visitor: NodeVisitor<TNode>,
) => {
	const mutations: Mutation[] = [];

	const visitNode = (node: ts.Node) => {
		if (request.filteredNodes.has(node)) {
			return;
		}

		if (selector(node)) {
			const mutation = tryGetMutation(request, node, visitor);

			if (mutation !== undefined) {
				mutations.push(mutation);
			}
		}

		ts.forEachChild(node, visitNode);
	};

	ts.forEachChild(request.sourceFile, visitNode);

	return mutations;
};

const tryGetMutation = <TNode extends ts.Node>(
	request: FileMutationsRequest,
	node: TNode,
	visitor: NodeVisitor<TNode>,
) => {
	try {
		return visitor(node, request);
	} catch (error) {
		request.options.output.stderr(
			`${EOL}Error in ${request.sourceFile.fileName} at node '${node.getText(
				request.sourceFile,
			)}' (position ${node.pos}):`,
		);
		request.options.output.stderr(`\t${getQuickErrorSummary(error)}`);
		request.options.output.stderr(EOL);
	}

	return undefined;
};
