import * as ts from "typescript";

import { getClassExtendsType } from "../../../../../shared/nodes";

export type ReactComponentNode = ReactClassComponentNode | ReactFunctionalComponentNode;

export type ReactClassComponentNode = ts.ClassDeclaration | ts.ClassExpression;

export type ReactFunctionalComponentNode = ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression;

export const isReactComponentNode = (node: ts.Node): node is ReactComponentNode => {
    if (ts.isArrowFunction(node) || ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) {
        return true;
    }

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
