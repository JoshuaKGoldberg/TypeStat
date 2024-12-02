import { combineMutations, Mutation } from "automutate";
import ts from "typescript";

import { createNonNullAssertion } from "../../../../mutations/typeMutating/createNonNullAssertion.js";
import { getManuallyAssignedTypeOfNode } from "../../../../shared/assignments.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import { getStaticNameOfProperty } from "../../../../shared/names.js";
import { isNullOrUndefinedMissingBetween } from "../../../../shared/nodeTypes.js";
import { getTypeAtLocationIfNotError } from "../../../../shared/types.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";

export const fixStrictNonNullAssertionObjectLiterals: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] => {
	const visitObjectLiteralExpression = (
		node: ts.ObjectLiteralExpression,
	): Mutation | undefined => {
		return getStrictPropertyFix(request, node);
	};

	return collectMutationsFromNodes(
		request,
		ts.isObjectLiteralExpression,
		visitObjectLiteralExpression,
	);
};

const getStrictPropertyFix = (
	request: FileMutationsRequest,
	node: ts.ObjectLiteralExpression,
): Mutation | undefined => {
	// Find the object type the node's properties are being assigned into
	const assignedType = getManuallyAssignedTypeOfNode(request, node);
	if (assignedType === undefined) {
		return undefined;
	}

	const propertyMutations = node.properties
		// Find all properties with a nullable value being passed into a non-nullable type
		.filter((property) => {
			// Ignore any property with a name that's not immediately convertible to a string
			const propertyName = getStaticNameOfProperty(property.name);
			if (propertyName === undefined) {
				return false;
			}

			// Also ignore any properties not declared in the assigned type
			const assignedProperty = assignedType.getProperty(propertyName);
			if (!assignedProperty) {
				return false;
			}

			// We'll mutate properties that are declared as non-nullable but assigned a nullable value
			const propertyType = getTypeAtLocationIfNotError(request, property);
			return (
				propertyType !== undefined &&
				isNullOrUndefinedMissingBetween(
					propertyType,
					request.services.program
						.getTypeChecker()
						.getDeclaredTypeOfSymbol(assignedProperty),
				)
			);
		})
		// Convert each of those properties into an assertion mutation
		.map((property) => createNonNullAssertion(request, property));

	return propertyMutations.length === 0
		? undefined
		: combineMutations(...propertyMutations);
};
