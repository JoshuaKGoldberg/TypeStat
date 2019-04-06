import * as ts from "typescript";

import { PropTypesAccessNode, PropTypesMembers } from "./propTypesExtraction";
import { createPropTypesProperty } from "./propTypesProperties";

export const createPropTypesTransform = ({ accessNode, nameNode }: Exclude<PropTypesMembers, "isRequired">): ts.TypeNode | undefined => {
    switch (nameNode.text) {
        case "array":
            return ts.createArrayTypeNode(ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));

        case "bool":
            return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);

        case "func":
            return ts.createTypeReferenceNode(ts.createIdentifier("Function"), undefined);

        case "element":
            // Todo: how to auto-import React just for its types?
            // Todo: is this the right type name?
            return ts.createTypeReferenceNode(ts.createIdentifier("ReactElement"), undefined);

        case "instanceOf":
            return createInstanceOfTransform(accessNode);

        case "number":
            return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);

        case "node":
            // Todo: how to auto-import React just for its types?
            return ts.createTypeReferenceNode(ts.createIdentifier("ReactNode"), undefined);

        case "object":
            return ts.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword);

        case "shape":
            return createShapeTransform(accessNode);

        case "string":
            return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

        case "symbol":
            return ts.createKeywordTypeNode(ts.SyntaxKind.SymbolKeyword);
    }

    // Todo: arrayOf
    // Todo: oneOf
    // Todo: oneOfType
    return undefined;
};

const createInstanceOfTransform = (accessNode: PropTypesAccessNode) => {
    if (!ts.isCallExpression(accessNode.parent) || accessNode.parent.arguments.length !== 1) {
        return undefined;
    }

    const className = accessNode.parent.arguments[0];
    if (!ts.isIdentifier(className)) {
        return undefined;
    }

    return ts.createTypeReferenceNode(ts.createIdentifier(className.text), undefined);
};

const createShapeTransform = (accessNode: PropTypesAccessNode) => {
    if (!ts.isCallExpression(accessNode.parent) || accessNode.parent.arguments.length !== 1) {
        return undefined;
    }

    const shape = accessNode.parent.arguments[0];
    // Todo: handle shared variables and `...` object spreads
    if (!ts.isObjectLiteralExpression(shape)) {
        return undefined;
    }

    const members: ts.TypeElement[] = [];

    for (const rawProperty of shape.properties) {
        const member = createPropTypesProperty(rawProperty);
        if (member !== undefined) {
            members.push(member);
        }
    }

    return ts.createTypeLiteralNode(members);
};
