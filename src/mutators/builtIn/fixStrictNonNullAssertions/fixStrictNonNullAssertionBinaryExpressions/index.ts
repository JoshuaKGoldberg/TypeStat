import { Mutation } from "automutate";
import * as tsutils from "ts-api-utils";
import ts from "typescript";

import { isTypeFlagSetRecursively } from "../../../../mutations/collecting/flags.js";
import { createNonNullAssertion } from "../../../../mutations/typeMutating/createNonNullAssertion.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import { isNodeAssigningBinaryExpression } from "../../../../shared/nodes.js";
import { getTypeAtLocationIfNotError } from "../../../../shared/types.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";

export const fixStrictNonNullAssertionBinaryExpressions: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] => {
	return collectMutationsFromNodes(
		request,
		isNodeAssigningBinaryExpression,
		visitBinaryExpression,
	);
};

const visitBinaryExpression = (
	node: ts.BinaryExpression,
	request: FileMutationsRequest,
): Mutation | undefined => {
	// Grab the types of the declared and assigned nodes
	const assignedType = getTypeAtLocationIfNotError(request, node.right);
	if (assignedType === undefined) {
		return undefined;
	}

	const declaredType = getTypeAtLocationIfNotError(request, node.left);
	if (declaredType === undefined || tsutils.isIntrinsicAnyType(declaredType)) {
		return undefined;
	}

	// We only care if the assigned type contains a strict flag the declared type doesn't
	if (
		(isTypeFlagSetRecursively(declaredType, ts.TypeFlags.Null) ||
			!isTypeFlagSetRecursively(assignedType, ts.TypeFlags.Null)) &&
		(isTypeFlagSetRecursively(declaredType, ts.TypeFlags.Undefined) ||
			!isTypeFlagSetRecursively(assignedType, ts.TypeFlags.Undefined))
	) {
		return undefined;
	}

	return createNonNullAssertion(request, node.right);
};
