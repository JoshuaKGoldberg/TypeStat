import ts from "typescript";

import { isReactComponentNode } from "./isReactComponentNode.js";

export const getReactComponentNode = (node: ts.Node) => {
	if (isReactComponentNode(node)) {
		return node;
	}

	if (
		ts.isVariableDeclaration(node) &&
		node.initializer !== undefined &&
		isReactComponentNode(node.initializer)
	) {
		return node.initializer;
	}

	return undefined;
};
