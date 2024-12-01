import ts from "typescript";

import { FileMutationsRequest } from "../../../../../../shared/fileMutator.js";
import {
	KnownTypeLiteralNode,
	transformLiteralToTypeLiteralNode,
} from "../../../../../../shared/transforms.js";
import {
	getPropTypesMember,
	PropTypesAccessNode,
	PropTypesMembers,
} from "./propTypesExtraction.js";
import { createPropTypesProperty } from "./propTypesProperties.js";

export const createPropTypesTransform = (
	request: FileMutationsRequest,
	{ accessNode, nameNode }: Exclude<PropTypesMembers, "isRequired">,
): ts.TypeNode | undefined => {
	switch (nameNode.text) {
		case "array":
			return ts.factory.createArrayTypeNode(
				ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
			);

		case "arrayOf":
			return createArrayOfTransform(request, accessNode);

		case "bool":
			return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);

		case "element":
			return ts.factory.createTypeReferenceNode(
				ts.factory.createIdentifier("React.ReactElement"),
				undefined,
			);

		case "func":
			return ts.factory.createTypeReferenceNode(
				ts.factory.createIdentifier("Function"),
				undefined,
			);

		case "instanceOf":
			return createInstanceOfTransform(accessNode);

		case "node":
			return ts.factory.createTypeReferenceNode(
				ts.factory.createIdentifier("React.ReactNode"),
				undefined,
			);

		case "number":
			return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);

		case "object":
			return ts.factory.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword);

		case "oneOf":
			return createOneOfTransform(accessNode);

		case "oneOfType":
			return createOneOfTypeTransform(request, accessNode);

		case "shape":
			return createShapeTransform(request, accessNode);

		case "string":
			return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

		case "symbol":
			return ts.factory.createKeywordTypeNode(ts.SyntaxKind.SymbolKeyword);
	}

	return undefined;
};

const createArrayOfTransform = (
	request: FileMutationsRequest,
	accessNode: PropTypesAccessNode,
) => {
	if (
		!ts.isCallExpression(accessNode.parent) ||
		accessNode.parent.arguments.length !== 1
	) {
		return undefined;
	}

	const memberTypeNode = getPropTypesMember(accessNode.parent.arguments[0]);
	if (memberTypeNode === undefined) {
		return undefined;
	}

	const innerTransform = createPropTypesTransform(request, memberTypeNode);
	if (innerTransform === undefined) {
		return undefined;
	}

	return ts.factory.createArrayTypeNode(innerTransform);
};

const createInstanceOfTransform = (accessNode: PropTypesAccessNode) => {
	if (
		!ts.isCallExpression(accessNode.parent) ||
		accessNode.parent.arguments.length !== 1
	) {
		return undefined;
	}

	const className = accessNode.parent.arguments[0];
	if (!ts.isIdentifier(className)) {
		return undefined;
	}

	return ts.factory.createTypeReferenceNode(
		ts.factory.createIdentifier(className.text),
		undefined,
	);
};

const createOneOfTransform = (accessNode: PropTypesAccessNode) => {
	if (
		!ts.isCallExpression(accessNode.parent) ||
		accessNode.parent.arguments.length !== 1
	) {
		return undefined;
	}

	const allowedItems = accessNode.parent.arguments[0];
	if (!ts.isArrayLiteralExpression(allowedItems)) {
		return undefined;
	}

	const allowedTypes = allowedItems.elements
		.map(transformLiteralToTypeLiteralNode)
		.filter(
			(typeNode): typeNode is KnownTypeLiteralNode => typeNode !== undefined,
		);
	if (allowedTypes.length === 0) {
		return undefined;
	}

	return ts.factory.createUnionTypeNode(allowedTypes);
};

const createOneOfTypeTransform = (
	request: FileMutationsRequest,
	accessNode: PropTypesAccessNode,
) => {
	if (
		!ts.isCallExpression(accessNode.parent) ||
		accessNode.parent.arguments.length !== 1
	) {
		return undefined;
	}

	const allowedItems = accessNode.parent.arguments[0];
	if (!ts.isArrayLiteralExpression(allowedItems)) {
		return undefined;
	}

	const allowedTypes = allowedItems.elements
		.map((element) => {
			if (
				!ts.isPropertyAccessExpression(element) ||
				!ts.isIdentifier(element.name)
			) {
				return undefined;
			}

			return createPropTypesTransform(request, {
				accessNode: element,
				nameNode: element.name,
			});
		})
		.filter((typeName): typeName is ts.TypeNode => typeName !== undefined);
	if (allowedTypes.length === 0) {
		return undefined;
	}

	return ts.factory.createUnionTypeNode(allowedTypes);
};

const createShapeTransform = (
	request: FileMutationsRequest,
	accessNode: PropTypesAccessNode,
) => {
	if (
		!ts.isCallExpression(accessNode.parent) ||
		accessNode.parent.arguments.length !== 1
	) {
		return undefined;
	}

	const shape = accessNode.parent.arguments[0];
	// Todo: handle shared variables and `...` object spreads
	if (!ts.isObjectLiteralExpression(shape)) {
		return undefined;
	}

	const members: ts.TypeElement[] = [];

	for (const rawProperty of shape.properties) {
		const member = createPropTypesProperty(request, rawProperty);
		if (member !== undefined) {
			members.push(member);
		}
	}

	return ts.factory.createTypeLiteralNode(members);
};
