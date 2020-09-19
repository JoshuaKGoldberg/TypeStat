import * as ts from "typescript";

/**
 * Description of a single prop type via PropTypes.
 */
export interface PropTypesMembers {
    /**
     * Parent node of the name node.
     */
    accessNode: PropTypesAccessNode;

    /**
     * `.isRequired` ending node, if it exists.
     */
    isRequired?: ts.Identifier | ts.PrivateIdentifier;

    /**
     * Node representing the name of the type, such as `number` or `shape`.
     */
    nameNode: ts.Identifier | ts.PrivateIdentifier;
}

/**
 * Node type that can represent the value for a PropTypes description.
 */
export type PropTypesAccessNode =
    /**
     * Called descriptor, such as `PropTypes.shapeOf({ ... })`.
     */
    | ts.CallExpression

    /**
     * Simple string descriptor, such as `PropTypes.number`.
     */
    | ts.PropertyAccessExpression;

/**
 * Selects the relevant member nodes for a PropTypes member expression.
 *
 * @param node
 * PropTypes assignment in an object literal, as one of:
 * `PropTypes.number`
 * `PropTypes.number.isRequired`
 * `PropTypes.shape({})`
 * `PropTypes.shape({}).isRequired`
 */
export const getPropTypesMember = (node: ts.Expression): PropTypesMembers | undefined => {
    if (ts.isCallExpression(node)) {
        return getPropTypesMemberFromCallExpression(node);
    }

    if (ts.isPropertyAccessExpression(node)) {
        return getPropTypesMemberFromPropertyAccessExpression(node);
    }

    return undefined;
};

/**
 * @remarks
 * Must be like `PropTypes.shape({})`, as `.isRequired` would make this a property access expression.
 */
const getPropTypesMemberFromCallExpression = (node: ts.CallExpression): PropTypesMembers | undefined => {
    const accessNode = node.expression;
    if (!ts.isPropertyAccessExpression(accessNode)) {
        return undefined;
    }

    const nameNode = accessNode.name;

    return { accessNode, nameNode };
};

/**
 * @remarks
 * Must be like `PropTypes.number`, `PropTypes.number.isRequired`, or `PropTypes.shape({}).isRequired`.
 */
const getPropTypesMemberFromPropertyAccessExpression = (node: ts.PropertyAccessExpression): PropTypesMembers | undefined => {
    const isRequired = node.name.text === "isRequired" ? node.name : undefined;

    return isRequired === undefined
        ? getPropTypesMemberFromPropertyAccessExpressionOptional(node)
        : getPropTypesMemberFromPropertyAccessExpressionRequired(node, isRequired);
};

/**
 * @remarks
 * Must be like `PropTypes.number`.
 */
const getPropTypesMemberFromPropertyAccessExpressionOptional = (node: ts.PropertyAccessExpression): PropTypesMembers | undefined => {
    return { accessNode: node, nameNode: node.name };
};

/**
 * @remarks
 * Must be like `PropTypes.shape({}).isRequired` or `PropTypes.number.isRequired`.
 */
const getPropTypesMemberFromPropertyAccessExpressionRequired = (
    node: ts.PropertyAccessExpression,
    isRequired: ts.Identifier | ts.PrivateIdentifier,
): PropTypesMembers | undefined => {
    const { expression } = node;

    if (ts.isCallExpression(expression)) {
        const callExpressionTypesMember = getPropTypesMemberFromCallExpression(expression);
        if (callExpressionTypesMember === undefined) {
            return undefined;
        }

        return {
            ...callExpressionTypesMember,
            isRequired,
        };
    }

    if (!ts.isPropertyAccessExpression(expression)) {
        return undefined;
    }

    return {
        accessNode: expression,
        isRequired,
        nameNode: expression.name,
    };
};
