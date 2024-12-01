import { combineMutations, Mutation, TextInsertMutation } from "automutate";
import ts from "typescript";

import { ReactPropTypesHint } from "../../../../../options/enums.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../../shared/fileMutator.js";
import { getClassExtendsType } from "../../../../../shared/nodes.js";
import { printNewLine } from "../../../../../shared/printing/newlines.js";
import { collectMutationsFromNodes } from "../../../../collectMutationsFromNodes.js";
import {
	isReactComponentNode,
	ReactComponentNode,
} from "../reactFiltering/isReactComponentNode.js";
import { createInterfaceUsageMutation } from "./annotation/createInterfaceUsageMutation.js";
import { createInterfaceFromPropTypes } from "./propTypes/createInterfaceFromPropTypes.js";
import { getPropTypesValue } from "./propTypes/getPropTypesValue.js";

/**
 * Creates an initial props type for a component from its PropTypes declaration.
 */
export const fixReactPropsFromPropTypes: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] => {
	if (request.options.hints.react.propTypes === ReactPropTypesHint.Ignore) {
		return [];
	}

	return collectMutationsFromNodes(
		request,
		isReactComponentNode,
		visitReactComponentNode,
	);
};

const visitReactComponentNode = (
	node: ReactComponentNode,
	request: FileMutationsRequest,
): Mutation | undefined => {
	// If the node is a class declaration, don't bother with prop types if it already declares a React.Component template
	if (ts.isClassDeclaration(node)) {
		const extendsType = getClassExtendsType(node);

		if (
			extendsType?.typeArguments !== undefined &&
			extendsType.typeArguments.length > 0
		) {
			return undefined;
		}
	}

	// Try to find a static `propTypes` member to indicate the interface
	// If it doesn't exist, we can't infer anything about the component here, so we bail out
	const propTypes = getPropTypesValue(node);
	if (propTypes === undefined) {
		return undefined;
	}

	// Since we did find the propTypes object, we can generate an interface from its members
	const { interfaceName, interfaceNode } = createInterfaceFromPropTypes(
		request,
		node,
		propTypes,
	);

	// That interface will be injected with blank lines around it just before the component
	const mutations: Mutation[] = [
		createInterfaceCreationMutation(request, node, interfaceNode),
	];

	// We'll also annotate the component with a type declaration to use the new prop type
	const usage = createInterfaceUsageMutation(node, interfaceName);
	if (usage !== undefined) {
		mutations.push(usage);
	}

	return combineMutations(...mutations);
};

const createInterfaceCreationMutation = (
	request: FileMutationsRequest,
	node: ReactComponentNode,
	interfaceNode: ts.InterfaceDeclaration,
): TextInsertMutation => {
	const endline = printNewLine(request.options.compilerOptions);
	const interfaceNodeText = request.services.printers.node(interfaceNode);

	return {
		insertion: [endline, endline, interfaceNodeText, endline].join(""),
		range: {
			begin: node.pos,
		},
		type: "text-insert",
	};
};
