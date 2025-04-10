import { Mutation } from "automutate";
import * as tsutils from "ts-api-utils";
import ts from "typescript";

import {
	createTypeAdditionMutation,
	createTypeCreationMutation,
} from "../../../../mutations/creators.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import { isNodeAssigningBinaryExpression } from "../../../../shared/nodes.js";
import { isNodeWithType, NodeWithType } from "../../../../shared/nodeTypes.js";
import { getTypeAtLocationIfNotError } from "../../../../shared/types.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";

export const fixIncompletePropertyDeclarationTypes: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] =>
	collectMutationsFromNodes(
		request,
		isPropertyDeclarationWithType,
		visitPropertyDeclaration,
	);

const isPropertyDeclarationWithType = (
	node: ts.Node,
): node is NodeWithType & ts.PropertyDeclaration =>
	ts.isPropertyDeclaration(node) && isNodeWithType(node);

const visitPropertyDeclaration = (
	node: ts.PropertyDeclaration,
	request: FileMutationsRequest,
): Mutation | undefined => {
	// Collect types later assigned to the property, and types initially declared by or inferred on the property
	const assignedTypes = collectPropertyAssignedTypes(node, request);
	const declaredType = getTypeAtLocationIfNotError(request, node);
	if (declaredType === undefined || tsutils.isIntrinsicAnyType(declaredType)) {
		return undefined;
	}

	// If the property already has a declared type, add assigned types to it if necessary
	if (isNodeWithType(node)) {
		return createTypeAdditionMutation(
			request,
			node,
			declaredType,
			assignedTypes,
		);
	}

	// Since the parameter doesn't have its own type, give it one if necessary
	return createTypeCreationMutation(request, node, declaredType, assignedTypes);
};

const collectPropertyAssignedTypes = (
	node: ts.PropertyDeclaration,
	request: FileMutationsRequest,
): readonly ts.Type[] => {
	const assignedTypes: ts.Type[] = [];

	// If the property has an initial value, consider that an assignment
	if (node.initializer !== undefined) {
		const initializerType = getTypeAtLocationIfNotError(
			request,
			node.initializer,
		);
		if (initializerType !== undefined) {
			assignedTypes.push(initializerType);
		}
	}

	// If the property is marked as readonly, don't bother checking for more types
	if (tsutils.isModifierFlagSet(node, ts.ModifierFlags.Readonly)) {
		return assignedTypes;
	}

	// Find everything else referencing the property
	const references = request.fileInfoCache.getNodeReferencesAsNodes(node);
	if (references !== undefined) {
		// For each referencing location, update types if the type is assigned to there
		for (const reference of references) {
			updateAssignedTypesForReference(
				node.parent,
				reference,
				assignedTypes,
				request,
			);
		}
	}

	return assignedTypes;
};

/**
 * Adds missing types for a reference to a property.
 * @param targetClass Class whose properties are being referenced.
 * @param identifier Node referencing the property.
 * @param assignedTypes In-progress collection of types assigned to a property.
 * @param request Metadata and settings to collect mutations in a file.
 */
const updateAssignedTypesForReference = (
	targetClass: ts.ClassLikeDeclaration,
	identifier: ts.Node,
	assignedTypes: ts.Type[],
	request: FileMutationsRequest,
): void => {
	// In order to write a new type, the referencing node should be an identifier...
	if (!ts.isIdentifier(identifier)) {
		return;
	}

	// ...contained as a name inside a property access...
	const propertyAccess = identifier.parent;
	if (
		!ts.isPropertyAccessExpression(propertyAccess) ||
		propertyAccess.name !== identifier
	) {
		return;
	}

	// ...contained as the left-hand side of an "=" binary expression...
	const binaryExpression = propertyAccess.parent;
	if (
		!isNodeAssigningBinaryExpression(binaryExpression) ||
		binaryExpression.left !== propertyAccess
	) {
		return;
	}

	// ...and where the original property access expression refers to the target class
	// (this is important when multiple child classes of a single base class redeclare a member, such as React.Component's state)
	const assigneeType = getTypeAtLocationIfNotError(
		request,
		propertyAccess.expression,
	);
	if (assigneeType?.getSymbol()?.valueDeclaration !== targetClass) {
		return;
	}

	// Mark the type of the right-hand side of the "=" expression as being assigned
	const assignmentType = getTypeAtLocationIfNotError(
		request,
		binaryExpression.right,
	);
	if (assignmentType !== undefined) {
		assignedTypes.push(assignmentType);
	}
};
