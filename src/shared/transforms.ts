import { isNullKeyword, isUndefinedKeyword } from "ts-api-utils";
import ts from "typescript";

export type KnownTypeLiteralNode =
	| ts.KeywordTypeNode
	| ts.LiteralTypeNode
	| ts.TypeQueryNode;

export const transformLiteralToTypeLiteralNode = (
	node: ts.Node,
): KnownTypeLiteralNode | undefined => {
	if (ts.isIdentifier(node)) {
		ts.factory.createTypeQueryNode(ts.factory.createIdentifier(node.text));
	}

	if (ts.isNumericLiteral(node)) {
		return ts.factory.createLiteralTypeNode(
			ts.factory.createNumericLiteral(node.text),
		);
	}

	if (ts.isStringLiteral(node)) {
		return ts.factory.createLiteralTypeNode(
			ts.factory.createStringLiteral(node.text),
		);
	}

	if (isNullKeyword(node)) {
		return ts.factory.createLiteralTypeNode(ts.factory.createNull());
	}

	if (isUndefinedKeyword(node)) {
		return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword);
	}

	return undefined;
};
