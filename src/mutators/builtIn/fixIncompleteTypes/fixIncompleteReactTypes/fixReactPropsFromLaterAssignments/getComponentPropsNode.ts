import * as ts from "typescript";

import { getClassExtendsType } from "../../../../../shared/nodes";
import { FileMutationsRequest } from "../../../../fileMutator";
import { ReactClassComponentNode, ReactComponentNode, ReactFunctionalComponentNode } from "../reactFiltering/isReactComponentNode";

export type ReactComponentPropsNode = ts.InterfaceDeclaration | ts.TypeLiteralNode;

/**
 * Finds the corresponding interface or type literal that declares a component's props type, if it exists.
 */
export const getComponentPropsNode = (request: FileMutationsRequest, node: ReactComponentNode): ReactComponentPropsNode | undefined => {
    return ts.isClassDeclaration(node) || ts.isClassExpression(node)
        ? getClassComponentPropsNode(request, node)
        : getFunctionalComponentPropsNode(request, node);
};

const getClassComponentPropsNode = (request: FileMutationsRequest, node: ReactClassComponentNode): ReactComponentPropsNode | undefined => {
    const extendsType = getClassExtendsType(node);
    if (extendsType === undefined || extendsType.typeArguments === undefined || extendsType.typeArguments.length === 0) {
        return undefined;
    }

    const [rawPropsNode] = extendsType.typeArguments;
    const propsNodeType = request.services.program.getTypeChecker().getTypeAtLocation(rawPropsNode);
    const propsNodeSymbol = propsNodeType.getSymbol();
    if (propsNodeSymbol === undefined) {
        return undefined;
    }

    const declaration = propsNodeSymbol.declarations.length === 0 ? undefined : propsNodeSymbol.declarations[0];

    return declaration !== undefined && isReactComponentPropsNode(declaration) ? declaration : undefined;
};

const getFunctionalComponentPropsNode = (
    request: FileMutationsRequest,
    node: ReactFunctionalComponentNode,
): ReactComponentPropsNode | undefined => {
    const { parameters } = node;
    if (parameters.length !== 1) {
        return undefined;
    }

    const [parameter] = parameters;
    const type = request.services.program.getTypeChecker().getTypeAtLocation(parameter);
    const symbol = type.getSymbol();
    if (symbol === undefined || symbol.declarations.length === 0) {
        return undefined;
    }

    const [declaration] = symbol.declarations;

    return isReactComponentPropsNode(declaration) ? declaration : undefined;
};

const isReactComponentPropsNode = (node: ts.Node): node is ReactComponentPropsNode =>
    ts.isInterfaceDeclaration(node) || ts.isTypeLiteralNode(node);
