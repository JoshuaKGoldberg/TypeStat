import * as ts from "typescript";
import { FileMutationsRequest } from "../mutators/fileMutator";
import { isNodeWithinNode } from "./nodes";

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
    const nodeType = request.services.program.getTypeChecker().getTypeAtLocation(node);
    const symbol = nodeType.getSymbol();
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

export const getVariableInitializerForExpression = (
    request: FileMutationsRequest,
    functionLike: FunctionLikeDeclarationWithType,
    expression: ts.Expression,
): ts.Expression | undefined => {
    if (!ts.isIdentifier(expression)) {
        return undefined;
    }

    const valueDeclaration = getValueDeclarationOfType(request, expression);
    if (valueDeclaration === undefined || !isNodeWithinNode(request.sourceFile, valueDeclaration, functionLike)) {
        return undefined;
    }

    if (!ts.isVariableDeclaration(valueDeclaration) || valueDeclaration.initializer === undefined) {
        return undefined;
    }

    return valueDeclaration.initializer;
};
