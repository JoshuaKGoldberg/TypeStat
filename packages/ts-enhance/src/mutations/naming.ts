import * as ts from "typescript";

import { FileMutationsRequest } from "../shared/fileMutator.js";

export const isUpperCaseLetter = (letter: string) => {
	return letter !== letter.toLowerCase();
};

export const getPerceivedNameOfClass = (
	request: FileMutationsRequest,
	node: ts.ClassLikeDeclaration,
): string => {
	// Classes with their own names are the most common and mostly friendly case
	if (node.name !== undefined) {
		return node.name.text;
	}

	// If the class is directly within a named variable, use that name
	const { parent } = node;
	if (ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
		return parent.name.text;
	}

	// We could probably do fancier things at this point but why bother...
	return request.nameGenerator.generateName("Class");
};

export const getFriendlyTypeParameterDeclarationName = (
	baseTypeParameters: ts.NodeArray<ts.TypeParameterDeclaration>,
	typeParameter: ts.TypeParameterDeclaration,
) => {
	const typeNameRaw = typeParameter.name.text;
	const typeNameFriendly =
		typeNameRaw.length > 1 &&
		typeNameRaw.startsWith("T") &&
		isUpperCaseLetter(typeNameRaw[1])
			? typeNameRaw.slice(1)
			: typeNameRaw;

	// If any sibling parameter actually happens to match the friendly name, use the raw instead
	for (const siblingParameter of baseTypeParameters) {
		if (
			siblingParameter !== typeParameter &&
			siblingParameter.name.text === typeNameFriendly
		) {
			return typeNameRaw;
		}
	}

	return typeNameFriendly;
};
