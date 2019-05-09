import * as ts from "typescript";

import { KnownTypeLiteralNode, transformLiteralToTypeLiteralNode } from "../../../../../../shared/transforms";

import { getPropTypesMember, PropTypesAccessNode, PropTypesMembers } from "./propTypesExtraction";
import { createPropTypesProperty } from "./propTypesProperties";

export const createPropTypesTransform = ({ accessNode, nameNode }: Exclude<PropTypesMembers, "isRequired">): ts.TypeNode | undefined => {
    switch (nameNode.text) {
        case "array":
            return ts.createArrayTypeNode(ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));

        case "arrayOf":
            return createArrayOfTransform(accessNode);

        case "bool":
            return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);

        case "func":
            return ts.createTypeReferenceNode(ts.createIdentifier("Function"), undefined);

        case "element":
            return ts.createTypeReferenceNode(ts.createIdentifier("React.ReactElement"), undefined);

        case "instanceOf":
            return createInstanceOfTransform(accessNode);

        case "number":
            return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);

        case "node":
            return ts.createTypeReferenceNode(ts.createIdentifier("React.ReactNode"), undefined);

        case "object":
            return ts.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword);

        case "oneOf":
            return createOneOfTransform(accessNode);

        case "oneOfType":
            return createOneOfTypeTransform(accessNode);

        case "shape":
            return createShapeTransform(accessNode);

        case "string":
            return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

        case "symbol":
            return ts.createKeywordTypeNode(ts.SyntaxKind.SymbolKeyword);
    }

    return undefined;
};

const createArrayOfTransform = (accessNode: PropTypesAccessNode) => {
    if (!ts.isCallExpression(accessNode.parent) || accessNode.parent.arguments.length !== 1) {
        return undefined;
    }

    const memberTypeNode = getPropTypesMember(accessNode.parent.arguments[0]);
    if (memberTypeNode === undefined) {
        return undefined;
    }

    const innerTransform = createPropTypesTransform(memberTypeNode);
    if (innerTransform === undefined) {
        return undefined;
    }

    return ts.createArrayTypeNode(innerTransform);
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

const createOneOfTransform = (accessNode: PropTypesAccessNode) => {
    if (!ts.isCallExpression(accessNode.parent) || accessNode.parent.arguments.length !== 1) {
        return undefined;
    }

    const allowedItems = accessNode.parent.arguments[0];
    if (!ts.isArrayLiteralExpression(allowedItems)) {
        return undefined;
    }

    const allowedTypes = allowedItems.elements
        .map(transformLiteralToTypeLiteralNode)
        .filter((typeNode): typeNode is KnownTypeLiteralNode => typeNode !== undefined);
    if (allowedTypes.length === 0) {
        return undefined;
    }

    return ts.createUnionTypeNode(allowedTypes);
};

const createOneOfTypeTransform = (accessNode: PropTypesAccessNode) => {
    if (!ts.isCallExpression(accessNode.parent) || accessNode.parent.arguments.length !== 1) {
        return undefined;
    }

    const allowedItems = accessNode.parent.arguments[0];
    if (!ts.isArrayLiteralExpression(allowedItems)) {
        return undefined;
    }

    const allowedTypes = allowedItems.elements
        .map((element) => {
            if (!ts.isPropertyAccessExpression(element) || !ts.isIdentifier(element.name)) {
                return undefined;
            }

            return createPropTypesTransform({
                accessNode: element,
                nameNode: element.name,
            });
        })
        .filter((typeName): typeName is ts.TypeNode => typeName !== undefined);
    if (allowedTypes.length === 0) {
        return undefined;
    }

    return ts.createUnionTypeNode(allowedTypes);
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
