import * as ts from "typescript";

import { isTypeFlagSetRecursively } from "../mutations/collecting/flags";
import { FileMutationsRequest } from "../mutators/fileMutator";

export type NodeSelector<TNode extends ts.Node> = (node: ts.Node) => node is TNode;

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

export type NodeWithIdentifierName = ts.Node & {
    name: ts.Identifier;
};

/**
 * Node types TypeStat may attempt to create a type declaration on.
 */
export type NodeWithCreatableType = ts.ParameterDeclaration | ts.PropertyDeclaration | ts.VariableDeclaration;

/**
 * Node types TypeStat may attempt to add to an existing type declaration on.
 */
export type NodeWithAddableType = NodeWithType &
    (ts.FunctionLikeDeclaration | ts.ParameterDeclaration | ts.PropertyDeclaration | ts.VariableDeclaration);

/**
 * Any function-like declaration that has an explicit type.
 */
export type FunctionLikeDeclarationWithType = ts.FunctionLikeDeclaration & NodeWithType;

// TODO: make this a more specific type
// Will have to deal with instantiations (new Container<T>() { ... }) and declarations (class Container<T>() { ... }))
export type NodeWithDefinedTypeArguments = ts.Node & {
    typeArguments: ts.NodeArray<ts.TypeNode>;
};

// TODO: make this a more specific type
// Will have to deal with instantiations (new Container<T>() { ... }) and declarations (class Container<T>() { ... }))
export type NodeWithDefinedTypeParameters = ts.Node & {
    typeParameters: ts.NodeArray<ts.TypeNode>;
};

export const isNodeWithType = (node: NodeWithOptionalType): node is NodeWithType => node.type !== undefined;

export const isNodeWithIdentifierName = (node: ts.Node): node is NodeWithIdentifierName => {
    return "name" in node;
};

export const isNodeWithDefinedTypeArguments = (node: ts.Node): node is NodeWithDefinedTypeArguments => {
    return "typeArguments" in node;
};

export const isNodeWithDefinedTypeParameters = (node: ts.Node): node is NodeWithDefinedTypeParameters => {
    return "typeParameters" in node;
};

export const getValueDeclarationOfType = (request: FileMutationsRequest, node: ts.Node): ts.Node | undefined => {
    // Try getting the symbol at the location, which sometimes only works in the latter form
    const nodeType = request.services.program.getTypeChecker().getTypeAtLocation(node);
    let symbol = nodeType.getSymbol();

    if (symbol === undefined) {
        symbol = request.services.program.getTypeChecker().getSymbolAtLocation(node);
    }

    if (symbol === undefined) {
        return undefined;
    }

    // Despite the type definition, valueDeclaration itself is sometimes undefined
    const valueDeclaration: ts.Declaration | undefined = symbol.valueDeclaration;
    // tslint:disable-next-line:strict-type-predicates
    if (valueDeclaration !== undefined) {
        return valueDeclaration;
    }

    // Since the real .valueDeclaration is undefined, use the first one we know of
    return symbol.declarations.length === 0 ? undefined : symbol.declarations[0];
};

/**
 * @returns Whether a type is in the argument but not in the parameter.
 */
export const isTypeMissingBetween = (typeFlag: ts.TypeFlags, typeOfArgument: ts.Type, typeOfParameter: ts.Type): boolean =>
    isTypeFlagSetRecursively(typeOfArgument, typeFlag) && !isTypeFlagSetRecursively(typeOfParameter, typeFlag);

export const getIdentifyingTypeLiteralParent = (node: ts.TypeLiteralNode) => {
    const { parent } = node;
    if (ts.isTypeAliasDeclaration(parent)) {
        return parent.name;
    }

    // ???
    return node;
};
