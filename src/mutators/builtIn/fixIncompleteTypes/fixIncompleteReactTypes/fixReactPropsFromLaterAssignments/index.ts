import { createTypeExpansionMutation } from "../../../../../mutations/expansions/expansionMutations";
import { collectMutationsFromNodes } from "../../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../../fileMutator";
import { isVisitableComponentNode, ReactComponentNode } from "../reactFiltering/isVisitableComponentClass";

import { getComponentAssignedTypesFromUsage } from "./getComponentAssignedTypesFromUsage";
import { getComponentPropsNode } from "./getComponentPropsNode";

/**
 * Expands the existing props type for a component from its usages.
 */
export const fixReactPropsFromLaterAssignments: FileMutator = (request) => {
    return collectMutationsFromNodes(request, isVisitableComponentNode, visitClassDeclaration);
};

const visitClassDeclaration = (node: ReactComponentNode, request: FileMutationsRequest) => {
    // Grab the node used to declare the node's props type, if it exists
    const propsNode = getComponentPropsNode(request, node);
    if (propsNode === undefined) {
        return undefined;
    }

    // Find all types of props later passed to the node
    const componentAssignedTypes = getComponentAssignedTypesFromUsage(request, node);
    if (componentAssignedTypes === undefined) {
        return undefined;
    }

    return createTypeExpansionMutation(request, propsNode, componentAssignedTypes);
};
