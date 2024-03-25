import { Mutation, combineMutations } from "automutate";
import ts from "typescript";

import { InterfaceOrTypeLiteral } from "../../mutators/builtIn/fixIncompleteTypes/fixIncompleteInterfaceOrTypeLiteralGenerics/collectGenericNodeReferences.js";
import { isNotUndefined } from "../../shared/arrays.js";
import { FileMutationsRequest } from "../../shared/fileMutator.js";
import { getStaticNameOfProperty } from "../../shared/names.js";
import {
	PropertySignatureWithType,
	isNodeWithType,
} from "../../shared/nodeTypes.js";
import { getTypeAtLocationIfNotError } from "../../shared/types.js";
import { AssignedTypesByName } from "../assignments.js";
import {
	TypeSummariesPerNodeByName,
	addIncompleteTypesToType,
} from "./addIncompleteTypesToType.js";
import { addMissingTypesToType } from "./addMissingTypesToType.js";
import { originalTypeHasIncompleteType } from "./eliminations.js";
import {
	TypeSummariesByName,
	summarizeAllAssignedTypes,
} from "./summarization.js";

/**
 * Given an interface or type declaration and a set of later-assigned types,
 * expands the original declaration to now also include the types.
 */
export const createTypeExpansionMutation = (
	request: FileMutationsRequest,
	node: InterfaceOrTypeLiteral,
	allAssignedTypes: AssignedTypesByName[],
): Mutation | undefined => {
	const originalPropertiesByName = groupPropertyDeclarationsByName(node);
	const summarizedAssignedTypes = summarizeAllAssignedTypes(
		request,
		allAssignedTypes,
	);
	const incompleteTypes: TypeSummariesPerNodeByName = new Map();
	const missingTypes: TypeSummariesByName = new Map();

	for (const [name, summary] of summarizedAssignedTypes) {
		// If the original type doesn't have the name at all, we'll need to add it in
		const originalProperty = originalPropertiesByName.get(name);
		if (originalProperty === undefined) {
			missingTypes.set(name, summary);
			continue;
		}

		// If the type matches an existing property in name but not in type, we'll add the new type in there
		const originalPropertyType = getTypeAtLocationIfNotError(
			request,
			originalProperty,
		);
		if (
			originalPropertyType !== undefined &&
			originalTypeHasIncompleteType(
				request,
				originalPropertyType,
				summary.types,
			)
		) {
			incompleteTypes.set(name, {
				originalProperty,
				originalPropertyType,
				summary,
			});
		}
	}

	const incompleteTypesMutations = addIncompleteTypesToType(
		request,
		incompleteTypes,
	);
	const missingTypesMutations = addMissingTypesToType(
		request,
		node,
		missingTypes,
	);
	const mutations = [incompleteTypesMutations, missingTypesMutations].filter(
		isNotUndefined,
	);

	return mutations.length === 0 ? undefined : combineMutations(...mutations);
};

const groupPropertyDeclarationsByName = (
	node: ts.InterfaceDeclaration | ts.TypeLiteralNode,
) => {
	const propertiesByName = new Map<string, PropertySignatureWithType>();

	for (const member of node.members) {
		// Ignore non-existent or implicitly typed members
		if (!ts.isPropertySignature(member) || !isNodeWithType(member)) {
			continue;
		}

		// Ignore any property with a name that's not immediately convertible to a string
		const name = getStaticNameOfProperty(member.name);
		if (name === undefined) {
			continue;
		}

		propertiesByName.set(name, member);
	}

	return propertiesByName;
};
