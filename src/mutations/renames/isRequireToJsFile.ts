import ts from "typescript";

export type LocalImplicitRequireCallExpression = ts.CallExpression & {
	arguments: [ts.StringLiteral];
};

export const isRequireToJsFile = (
	node: ts.Node,
): node is LocalImplicitRequireCallExpression => {
	if (
		!ts.isCallExpression(node) ||
		ts.isAsExpression(node.parent) ||
		ts.isTypeAssertionExpression(node.parent) ||
		node.arguments.length !== 1
	) {
		return false;
	}

	const firstArgument = node.arguments[0];

	return (
		ts.isStringLiteral(firstArgument) &&
		firstArgument.text.match(/\.(.*)\.jsx?$/i) !== null
	);
};
