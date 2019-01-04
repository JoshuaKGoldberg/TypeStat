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

export const isNodeWithType = (node: NodeWithOptionalType): node is NodeWithType => node.type !== undefined;

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
