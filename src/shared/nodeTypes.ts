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

export const nodeContainsType = (node: NodeWithOptionalType): node is NodeWithType =>
    node.type !== undefined;
