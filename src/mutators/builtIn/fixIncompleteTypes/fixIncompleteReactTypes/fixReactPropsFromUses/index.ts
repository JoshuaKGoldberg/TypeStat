import { createTypeExpansionMutation } from "../../../../../mutations/expansions/expansionMutations";
import { collectMutationsFromNodes } from "../../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../../../shared/fileMutator";
import { isReactComponentNode, ReactComponentNode } from "../reactFiltering/isReactComponentNode";

import { getComponentPropsNode } from "../getComponentPropsNode";
import { getPropsUsageTypes } from "./getPropsUsageTypes";

/**
 * Expands the existing props type for a component from its external JSX-style declarations.
 */
export const fixReactPropsFromUses: FileMutator = (request) => {
    return collectMutationsFromNodes(request, isReactComponentNode, visitReactComponentNode);
};

const visitReactComponentNode = (node: ReactComponentNode, request: FileMutationsRequest) => {
    // Grab the node used to declare the node's props type, if it exists
    const propsNode = getComponentPropsNode(request, node);
    if (propsNode === undefined) {
        return undefined;
    }

    // Find all types of props later passed to the node
    const componentAssignedTypes = getPropsUsageTypes(request, node, propsNode);
    if (componentAssignedTypes === undefined || componentAssignedTypes.length === 0) {
        return undefined;
    }

    return createTypeExpansionMutation(request, propsNode, componentAssignedTypes);
};
