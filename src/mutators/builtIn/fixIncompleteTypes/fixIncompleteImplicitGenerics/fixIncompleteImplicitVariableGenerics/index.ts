import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../../shared/fileMutator.js";
import { collectMutationsFromNodes } from "../../../../collectMutationsFromNodes.js";
import { collectGenericUses } from "./collectGenericUses.js";
import { createExplicitGenericType } from "./createExplicitGenericType.js";
import { getGenericClassDetails } from "./getGenericClassDetails.js";
import {
	isVariableWithImplicitGeneric,
	VariableWithImplicitGeneric,
} from "./implicitGenericTypes.js";

export const fixIncompleteImplicitVariableGenerics: FileMutator = (
	request: FileMutationsRequest,
) =>
	collectMutationsFromNodes(
		request,
		isVariableWithImplicitGeneric,
		visitVariableWithImplicitGeneric,
	);

const visitVariableWithImplicitGeneric = (
	node: VariableWithImplicitGeneric,
	request: FileMutationsRequest,
) => {
	// Get the type of class the variable is an instance of, such as [] (Array) or Map
	// If the variable's class didn't have generics, we can ignore this
	const genericClassDetails = getGenericClassDetails(request, node);
	if (genericClassDetails === undefined) {
		return undefined;
	}

	// Find places where the node was either assigned a known type or its method was called with a type
	// If the node is never used with a (non-any) type, there's nothing we can (or would want) to do
	const assignedGenericTypes = collectGenericUses(
		request,
		node,
		genericClassDetails,
	);
	if (assignedGenericTypes === undefined || assignedGenericTypes.size === 0) {
		return undefined;
	}

	// Combine those type uses into a new explicit generic type on the node
	return createExplicitGenericType(
		request,
		node,
		genericClassDetails,
		assignedGenericTypes,
	);
};
