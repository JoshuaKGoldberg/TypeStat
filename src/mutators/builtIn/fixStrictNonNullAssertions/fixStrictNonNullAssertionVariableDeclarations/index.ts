import { Mutation } from "automutate";
import ts from "typescript";

import { createNonNullAssertion } from "../../../../mutations/typeMutating/createNonNullAssertion.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import { getTypeAtLocationIfNotError } from "../../../../shared/types.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";

export const fixStrictNonNullAssertionVariableDeclarations: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] =>
	collectMutationsFromNodes(
		request,
		ts.isVariableDeclaration,
		visitVariableDeclaration,
	);

const visitVariableDeclaration = (
	node: ts.VariableDeclaration,
	request: FileMutationsRequest,
): Mutation | undefined => {
	if (!node.initializer || !ts.isIdentifier(node.name)) {
		return undefined;
	}

	const declaredType = getTypeAtLocationIfNotError(request, node.type);
	const assignedType = getTypeAtLocationIfNotError(request, node.initializer);
	if (declaredType === undefined || assignedType === undefined) {
		return undefined;
	}

	const typeChecker = request.services.program.getTypeChecker();
	if (
		typeChecker.isTypeAssignableTo(assignedType, declaredType) ||
		!typeChecker.isTypeAssignableTo(
			typeChecker.getNonNullableType(assignedType),
			declaredType,
		)
	) {
		return undefined;
	}

	return createNonNullAssertion(request, node.initializer);
};
