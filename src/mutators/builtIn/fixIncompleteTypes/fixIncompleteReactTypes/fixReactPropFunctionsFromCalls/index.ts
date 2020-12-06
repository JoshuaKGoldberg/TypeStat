import { collectMutationsFromNodes } from "../../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../../fileMutator";
import { isReactComponentNode, ReactComponentNode } from "../reactFiltering/isReactComponentNode";

import { getComponentPropsNode } from "../getComponentPropsNode";
import { collectAllFunctionCallTypes } from "./collectAllFunctionCallTypes";
import { createFunctionCallTypesMutation } from "./createFunctionCallTypesMutation";

/**
 * Expands a component's props declared as Function to be more specific types.
 */
export const fixReactPropFunctionsFromCalls: FileMutator = (request) => {
    return collectMutationsFromNodes(request, isReactComponentNode, visitReactComponentNode);
};

const visitReactComponentNode = (node: ReactComponentNode, request: FileMutationsRequest) => {
    // Grab the node used to declare the node's props type, if it exists
    const propsNode = getComponentPropsNode(request, node);
    if (propsNode === undefined) {
        return undefined;
    }

    // Find all Function prop calls used internally within the node
    const allFunctionCallTypes = collectAllFunctionCallTypes(request, propsNode);
    if (allFunctionCallTypes === undefined) {
        return undefined;
    }

    return createFunctionCallTypesMutation(request, propsNode, allFunctionCallTypes);
};
