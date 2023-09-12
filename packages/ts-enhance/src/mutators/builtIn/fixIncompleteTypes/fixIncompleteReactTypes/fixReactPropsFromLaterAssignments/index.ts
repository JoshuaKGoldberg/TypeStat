import { createTypeExpansionMutation } from "../../../../../mutations/expansions/expansionMutations.js";
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
import { getComponentAssignedTypesFromUsage } from "./getComponentAssignedTypesFromUsage.js";

/**
 * Expands the existing props type for a component from its external JSX-style declarations.
 */
export const fixReactPropsFromLaterAssignments: FileMutator = (request) => {
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

	// Find all types of props later passed to the node
	const componentAssignedTypes = getComponentAssignedTypesFromUsage(
		request,
		node,
	);
	if (
		componentAssignedTypes === undefined ||
		componentAssignedTypes.length === 0
	) {
		return undefined;
	}

	return createTypeExpansionMutation(
		request,
		propsNode,
		componentAssignedTypes,
	);
};
