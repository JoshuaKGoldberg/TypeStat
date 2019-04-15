import * as ts from "typescript";

import { getClassExtendsType } from "../../../../../shared/nodes";

/**
 * @remarks Eventually, this should also allow functional components.
 */
export type ReactComponentNode = ts.ClassDeclaration;

export const isVisitableComponentNode = (node: ts.Node): node is ReactComponentNode => {
    if (!ts.isClassDeclaration(node)) {
        return false;
    }

    const extendsType = getClassExtendsType(node);

    return extendsType === undefined ? false : extensionExpressionIsReactComponent(extendsType);
};

const extensionExpressionIsReactComponent = (node: ts.ExpressionWithTypeArguments): boolean => {
    // Todo: actually check the type for this
    // See https://github.com/JoshuaKGoldberg/TypeStat/issues/135
    return node.getText().includes("Component");
};
