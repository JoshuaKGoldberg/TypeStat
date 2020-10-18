import * as ts from "typescript";

export type KnownTypeLiteralNode = ts.KeywordTypeNode | ts.LiteralTypeNode | ts.TypeQueryNode;

export const transformLiteralToTypeLiteralNode = (node: ts.Node): KnownTypeLiteralNode | undefined => {
    if (ts.isIdentifier(node)) {
        ts.factory.createTypeQueryNode(ts.factory.createIdentifier(node.text));
    }

    if (ts.isNumericLiteral(node)) {
        return ts.factory.createLiteralTypeNode(ts.factory.createNumericLiteral(node.text));
    }

    if (ts.isStringLiteral(node)) {
        return ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(node.text));
    }

    if (node.kind === ts.SyntaxKind.NullKeyword) {
        return ts.factory.createLiteralTypeNode(ts.factory.createNull());
    }

    if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
        return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword);
    }

    return undefined;
};
