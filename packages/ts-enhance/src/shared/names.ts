import * as ts from "typescript";

/**
 * Gets the name of a property if it's statically computable from text.
 */
export const getStaticNameOfProperty = (node: ts.Node | undefined) => {
	if (node === undefined) {
		return undefined;
	}

	if (
		ts.isIdentifier(node) ||
		ts.isStringLiteral(node) ||
		ts.isNumericLiteral(node)
	) {
		return node.text;
	}

	return undefined;
};
