import { IMutation, ITextInsertMutation } from "automutate";

import { printNewLine } from "../../../../../shared/printing";
import { collectMutationsFromNodes } from "../../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../../fileMutator";
import { isReactComponentNode, ReactComponentNode } from "../reactFiltering/isReactComponentNode";

import { createInterfaceFromPropTypes } from "./propTypes/createInterfaceFromPropTypes";
import { getPropTypesValue } from "./propTypes/getPropTypesValue";

/**
 * Creates an initial props type for a component from its PropTypes declaration.
 */
export const fixReactPropsFromPropTypes: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    return collectMutationsFromNodes(request, isReactComponentNode, visitClassDeclaration);
};

const visitClassDeclaration = (node: ReactComponentNode, request: FileMutationsRequest): ITextInsertMutation | undefined => {
    // Try to find a static `propTypes` member to indicate the interface
    // If it doesn't exist, we can't infer anything about the class here, so we bail out
    const propTypes = getPropTypesValue(node);
    if (propTypes === undefined) {
        return undefined;
    }

    // Since we did find the propTypes object, we can generate an interface from its members
    // That interface will be injected with blank lines around it just before the class
    const interfaceNode = createInterfaceFromPropTypes(node, propTypes);
    const interfaceNodeText = request.services.printNode(interfaceNode);
    const endline = printNewLine(request.options.compilerOptions);

    return {
        insertion: [endline, endline, interfaceNodeText, endline].join(""),
        range: {
            begin: node.pos,
        },
        type: "text-insert",
    };
};
