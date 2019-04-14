import * as ts from "typescript";

import { getClassExtendsType } from "../../../../../shared/nodes";
import { FileMutationsRequest } from "../../../../fileMutator";
import { ReactComponentNode } from "../reactFiltering/isVisitableComponentClass";

export type ReactComponentPropsNode = ts.InterfaceDeclaration | ts.TypeLiteralNode;

/**
 * Finds the corresponding interface or type literal to declare a component's props type, if it exists.
 */
export const getComponentPropsNode = (request: FileMutationsRequest, node: ReactComponentNode): ReactComponentPropsNode | undefined => {
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

const isReactComponentPropsNode = (node: ts.Node): node is ReactComponentPropsNode =>
    ts.isInterfaceDeclaration(node) || ts.isTypeLiteralNode(node);
