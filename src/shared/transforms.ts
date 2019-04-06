import * as ts from "typescript";

export type KnownTypeLiteralNode =
    | ts.KeywordTypeNode
    | ts.LiteralTypeNode
    | ts.NullLiteral & ts.Token<ts.SyntaxKind.NullKeyword>
    | ts.TypeQueryNode;

export const transformLiteralToTypeLiteralNode = (node: ts.Node): KnownTypeLiteralNode | undefined => {
    if (ts.isIdentifier(node)) {
        ts.createTypeQueryNode(ts.createIdentifier(node.text));
    }

    if (ts.isNumericLiteral(node)) {
        return ts.createLiteralTypeNode(ts.createNumericLiteral(node.text));
    }

    if (ts.isStringLiteral(node)) {
        return ts.createLiteralTypeNode(ts.createStringLiteral(node.text));
    }

    if (node.kind === ts.SyntaxKind.NullKeyword) {
        return ts.createNull();
    }

    if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
        return ts.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword);
    }

    return undefined;
};
