import ts from "typescript";

import { getClassExtendsType } from "../../../../../shared/nodes.js";

export type ReactComponentNode =
	| ReactClassComponentNode
	| ReactFunctionalComponentNode;

export type ReactClassComponentNode = {
	heritageClauses: ts.NodeArray<ts.HeritageClause>;
} & (ts.ClassDeclaration | ts.ClassExpression);

export type ReactFunctionalComponentNode =
	| ts.ArrowFunction
	| ts.FunctionDeclaration
	| ts.FunctionExpression;

/**
 * @returns Whether the node is able to be a React component node.
 */
export const isReactComponentNode = (
	node: ts.Node,
): node is ReactComponentNode => {
	// Functions can generally be React components if they have 0 or 1 parameters
	if (
		ts.isArrowFunction(node) ||
		ts.isFunctionDeclaration(node) ||
		ts.isFunctionExpression(node)
	) {
		return node.parameters.length <= 1;
	}

	// Otherwise, we only look at class declarations and class expressions
	if (!ts.isClassLike(node)) {
		return false;
	}

	const extendsType = getClassExtendsType(node);

	return (
		extendsType !== undefined &&
		extensionExpressionIsReactComponent(extendsType)
	);
};

const extensionExpressionIsReactComponent = (
	node: ts.ExpressionWithTypeArguments,
): boolean => {
	// Todo: actually check the type for this
	// See https://github.com/JoshuaKGoldberg/TypeStat/issues/135
	return node.getText().includes("Component");
};
