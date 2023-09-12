import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../../shared/fileMutator.js";
import { collectMutationsFromNodes } from "../../../../collectMutationsFromNodes.js";
import { getComponentPropsNode } from "../getComponentPropsNode.js";
import {
	ReactComponentNode,
	isReactComponentNode,
} from "../reactFiltering/isReactComponentNode.js";
import { collectAllFunctionCallTypes } from "./collectAllFunctionCallTypes.js";
import { createFunctionCallTypesMutation } from "./createFunctionCallTypesMutation.js";

/**
 * Expands a component's props declared as Function to be more specific types.
 */
export const fixReactPropFunctionsFromCalls: FileMutator = (request) => {
	return collectMutationsFromNodes(
		request,
		isReactComponentNode,
		visitReactComponentNode,
	);
};

const visitReactComponentNode = (
	node: ReactComponentNode,
	request: FileMutationsRequest,
) => {
	// Grab the node used to declare the node's props type, if it exists
	const propsNode = getComponentPropsNode(request, node);
	if (propsNode === undefined) {
		return undefined;
	}

	// Find all Function prop calls used internally within the node
	return createFunctionCallTypesMutation(
		request,
		collectAllFunctionCallTypes(request, propsNode),
	);
};
