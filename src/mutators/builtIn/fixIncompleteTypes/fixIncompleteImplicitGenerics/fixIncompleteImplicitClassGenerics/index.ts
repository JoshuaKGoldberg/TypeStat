import { combineMutations, Mutation } from "automutate";
import ts from "typescript";

import { isNotUndefined } from "../../../../../shared/arrays.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../../shared/fileMutator.js";
import { getBaseClassDeclaration } from "../../../../../shared/nodeExtensions.js";
import { getClassExtendsType } from "../../../../../shared/nodes.js";
import { collectMutationsFromNodes } from "../../../../collectMutationsFromNodes.js";
import { addMissingTemplateTypes, addNewTypeNodes } from "../additions.js";
import { findMissingTemplateTypes } from "../templateCollecting.js";
import { fillInMissingTemplateTypes } from "../templateMutating.js";

export const fixIncompleteImplicitClassGenerics: FileMutator = (
	request: FileMutationsRequest,
) => collectMutationsFromNodes(request, ts.isClassLike, visitClassLike);

const visitClassLike = (
	node: ts.ClassLikeDeclaration,
	request: FileMutationsRequest,
): Mutation | undefined => {
	// We'll want a class node that extends some base class
	const extension = getClassExtendsType(node);
	if (extension === undefined) {
		return undefined;
	}

	// If that base class doesn't include type parameters, there's nothing to fill out
	const baseClass = getBaseClassDeclaration(request, extension);
	if (baseClass?.typeParameters === undefined) {
		return undefined;
	}

	// If that class declares any templated types, check the node's types assigned as them
	const missingTemplateTypes = findMissingTemplateTypes(
		request,
		node,
		baseClass,
	);

	// We can skip performing any mutation if none of the parameter types had missing types
	if (
		missingTemplateTypes.length === 0 ||
		!missingTemplateTypes.some(isNotUndefined)
	) {
		return undefined;
	}

	// Collect type names to fill in and their corresponding new type declarations
	const { createdTypes, templateTypeNames } = fillInMissingTemplateTypes(
		request,
		node,
		baseClass.typeParameters,
		missingTemplateTypes,
	);

	// Print the new types above the class and fill in the new template types
	return combineMutations(
		addNewTypeNodes(request, node, createdTypes),
		addMissingTemplateTypes(extension, templateTypeNames),
	);
};
