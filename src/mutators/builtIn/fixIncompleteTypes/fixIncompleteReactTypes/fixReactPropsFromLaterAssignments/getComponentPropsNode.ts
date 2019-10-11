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

        const [rawPropsNode] = extendsType.typeArguments,
            propsNodeType = request.services.program.getTypeChecker().getTypeAtLocation(rawPropsNode),
            propsNodeSymbol = propsNodeType.getSymbol();
        if (propsNodeSymbol === undefined) {
            return undefined;
        }

        const symbolDeclarations = propsNodeSymbol.getDeclarations(),
            declaration = symbolDeclarations === undefined || symbolDeclarations.length === 0 ? undefined : symbolDeclarations[0];

        return declaration !== undefined && isReactComponentPropsNode(declaration) ? declaration : undefined;
    },
    getFunctionalComponentPropsNode = (
        request: FileMutationsRequest,
        node: ReactFunctionalComponentNode,
    ): ReactComponentPropsNode | undefined => {
        const { parameters } = node;
        if (parameters.length !== 1) {
            return undefined;
        }

        const [parameter] = parameters,
            type = request.services.program.getTypeChecker().getTypeAtLocation(parameter),
            symbol = type.getSymbol();
        if (symbol === undefined || symbol.declarations.length === 0) {
            return undefined;
        }

        const [declaration] = symbol.declarations;

        return isReactComponentPropsNode(declaration) ? declaration : undefined;
    },
    isReactComponentPropsNode = (node: ts.Node): node is ReactComponentPropsNode =>
        ts.isInterfaceDeclaration(node) || ts.isTypeLiteralNode(node);
