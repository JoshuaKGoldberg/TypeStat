import * as ts from "typescript";

/**
 * Any node type that may optionally contain a type annotation.
 */
export type NodeWithOptionalType = ts.Node & {
    type?: ts.TypeNode;
};

/**
 * Any node type that contains a type annotation.
 */
export type NodeWithType = ts.Node & {
    type: ts.TypeNode;
};

/**
 * Node types TypeStat may attempt to create a type declaration on.
 */
export type NodeWithCreatableType = (
    | ts.ParameterDeclaration
    | ts.PropertyDeclaration
    | ts.VariableDeclaration
);

/**
 * Node Types TypeStat may attempt to add to an existing type declaration on.
 */
export type NodeWithAddableType = NodeWithType & (
    | ts.FunctionLikeDeclaration
    | ts.ParameterDeclaration
    | ts.PropertyDeclaration
    | ts.VariableDeclaration
);

export const isNodeWithType = (node: NodeWithOptionalType): node is NodeWithType =>
    node.type !== undefined;
