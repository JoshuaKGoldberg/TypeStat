import * as ts from "typescript";

import { getClassExtendsType } from "../../../../shared/nodes";
import { getTypeAtLocationIfNotError } from "../../../../shared/types";
import { FileMutationsRequest } from "../../../../shared/fileMutator";
import {
    ReactClassComponentNode,
    ReactComponentNode,
    ReactFunctionalComponentNode as ReactFunctionComponentNode,
} from "./reactFiltering/isReactComponentNode";

export type ReactComponentPropsNode = ts.InterfaceDeclaration | ts.TypeLiteralNode;

/**
 * Finds the corresponding interface or type literal that declares a component's props type, if it exists.
 */
export const getComponentPropsNode = (request: FileMutationsRequest, node: ReactComponentNode): ReactComponentPropsNode | undefined => {
    return ts.isClassDeclaration(node) || ts.isClassExpression(node)
        ? getClassComponentPropsNode(request, node)
        : getFunctionComponentPropsNode(request, node);
};

const getClassComponentPropsNode = (request: FileMutationsRequest, node: ReactClassComponentNode): ReactComponentPropsNode | undefined => {
    const extendsType = getClassExtendsType(node);
    if (extendsType?.typeArguments === undefined || extendsType.typeArguments.length === 0) {
        return undefined;
    }

    const [rawPropsNode] = extendsType.typeArguments;
    const propsNodeType = getTypeAtLocationIfNotError(request, rawPropsNode);
    const propsNodeSymbol = propsNodeType?.getSymbol();
    if (propsNodeSymbol === undefined) {
        return undefined;
    }

    const symbolDeclarations = propsNodeSymbol.getDeclarations();
    const declaration = symbolDeclarations === undefined || symbolDeclarations.length === 0 ? undefined : symbolDeclarations[0];

    return declaration !== undefined && isReactComponentPropsNode(declaration) ? declaration : undefined;
};

const getFunctionComponentPropsNode = (
    request: FileMutationsRequest,
    node: ReactFunctionComponentNode,
): ReactComponentPropsNode | undefined => {
    // If the node takes multiple parameters, we assume it's not an FC
    // TODO: this might not hold true for refs or other fancy things...
    const { parameters } = node;
    if (parameters.length !== 1) {
        return undefined;
    }

    // Try to get the first backing type declaration for the single parameter
    const [parameter] = parameters;
    const symbol = getTypeAtLocationIfNotError(request, parameter)?.getSymbol();
    if (!symbol?.declarations?.length) {
        return undefined;
    }

    const [declaration] = symbol.declarations;
    // If the declaration is in another file... well, let's assume it's unrelated.
    // TODO: We'll eventually need to handle shared props types.
    if (isReactComponentPropsNode(declaration) && declaration.getSourceFile() === request.sourceFile) {
        return declaration;
    }

    return undefined;
};

const isReactComponentPropsNode = (node: ts.Node): node is ReactComponentPropsNode =>
    ts.isInterfaceDeclaration(node) || ts.isTypeLiteralNode(node);
