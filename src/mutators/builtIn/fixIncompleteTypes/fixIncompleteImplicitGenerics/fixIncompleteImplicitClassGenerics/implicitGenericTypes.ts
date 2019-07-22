import * as tsutils from "tsutils";
import * as ts from "typescript";

export type VariableWithImplicitGeneric = ts.VariableDeclaration & {
    initializer: ts.Expression;
    type: undefined;
};

const ignoredTypes = new Set([
    ts.SyntaxKind.ArrowFunction,
    ts.SyntaxKind.BigIntLiteral,
    ts.SyntaxKind.FunctionExpression,
    ts.SyntaxKind.NumericLiteral,
    ts.SyntaxKind.ObjectLiteralExpression,
    ts.SyntaxKind.StringLiteral,
]);

export const isVariableWithImplicitGeneric = (node: ts.Node): node is VariableWithImplicitGeneric =>
    // We'll be looking at variable declarations...
    ts.isVariableDeclaration(node) &&
    // ...without a predeclared type...
    node.type === undefined &&
    // ...but with an initially declared value...
    node.initializer !== undefined &&
    // ...that isn't a keyword or otherwise ignored type (one that doesn't have *type* generics)
    !(tsutils.isKeywordKind(node.initializer.kind) || ignoredTypes.has(node.initializer.kind));
