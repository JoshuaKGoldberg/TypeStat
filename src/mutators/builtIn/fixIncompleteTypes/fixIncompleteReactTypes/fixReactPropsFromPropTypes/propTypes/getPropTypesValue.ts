import * as tsutils from "tsutils";
import * as ts from "typescript";

import { ReactComponentNode } from "../../reactFiltering/isReactComponentNode";

type PropTypesMember = ts.PropertyDeclaration & {
    initializer: ts.ObjectLiteralExpression;
    name: {
        kind: ts.SyntaxKind.Identifier;
        text: "propTypes";
    };
};

/**
 * @returns Whether a node is a `propTypes` class member with an object literal value.
 */
const getStaticPropTypes = (node: ts.ClassElement): node is PropTypesMember =>
        ts.isPropertyDeclaration(node) &&
        tsutils.hasModifier(node.modifiers, ts.SyntaxKind.StaticKeyword) &&
        ts.isIdentifier(node.name) &&
        node.name.text === "propTypes" &&
        node.initializer !== undefined &&
        ts.isObjectLiteralExpression(node.initializer),
    getPropTypesChildFromParent = (parent: ts.Node, className: string) => {
        let result: ts.ObjectLiteralExpression | undefined;

        parent.forEachChild((child: ts.Node) => {
            const propTypes = isPropTypesStatement(child, className);
            if (propTypes !== undefined) {
                result = propTypes;
                return true;
            }

            return false;
        });

        return result;
    },
    /**
     * @returns Object literal `propTypes` assigned to the class, if it exists in a sibling property setter.
     */
    isPropTypesStatement = (node: ts.Node, className: string) => {
        if (!ts.isExpressionStatement(node) || !ts.isBinaryExpression(node.expression)) {
            return undefined;
        }

        const { left, right } = node.expression;
        if (
            !ts.isPropertyAccessExpression(left) ||
            !ts.isIdentifier(left.expression) ||
            left.expression.text !== className ||
            !ts.isIdentifier(left.name) ||
            left.name.text !== "propTypes" ||
            !ts.isObjectLiteralExpression(right)
        ) {
            return undefined;
        }

        return right;
    };

/**
 * Finds the equivalent `propTypes` object literal for a class, if it exists.
 *
 * @todo
 * This assumes an object literal (`{ ... }`) with all inline members.
 * It doesn't yet handle shared variable references or `...` spread operations.
 */
export const getPropTypesValue = (node: ReactComponentNode): ts.ObjectLiteralExpression | undefined => {
    // If the component's parent declares a prop types for it, use it
    if (node.name !== undefined) {
        const propTypesStatement = getPropTypesChildFromParent(node.parent, node.name.text);
        if (propTypesStatement !== undefined) {
            return propTypesStatement;
        }
    }

    // If the component is a class that declares its own static prop types, use it
    if (ts.isClassDeclaration(node)) {
        const staticPropTypes = node.members.find(getStaticPropTypes);

        if (staticPropTypes !== undefined) {
            return staticPropTypes.initializer;
        }
    }

    // Since none of the above worked out, assume no prop types are declared
    return undefined;
};
