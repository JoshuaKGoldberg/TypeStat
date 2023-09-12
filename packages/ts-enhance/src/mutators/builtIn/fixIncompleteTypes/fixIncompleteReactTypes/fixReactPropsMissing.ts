import { combineMutations } from "automutate";
import * as ts from "typescript";

import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import { printNewLine } from "../../../../shared/printing/newlines.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";
import { getApparentNameOfComponent } from "./getApparentNameOfComponent.js";
import { getComponentPropsNode } from "./getComponentPropsNode.js";
import {
	ReactComponentNode,
	isReactComponentNode,
} from "./reactFiltering/isReactComponentNode.js";

/**
 * Creates a new props type for a React component from scratch.
 */
export const fixReactPropsMissing: FileMutator = (request) => {
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
	// Make sure a node doesn't yet exist to declare the node's props type
	const propsNode = getComponentPropsNode(request, node);
	if (propsNode !== undefined) {
		return undefined;
	}

	// Find all types of props later passed to the node
	const attributeTypesAndRequirements = collectComponentAttributeTypes(
		request,
		node,
	);
	if (!attributeTypesAndRequirements?.attributeTypes.size) {
		return undefined;
	}

	// Generate a name for a new props interface to use on the node
	const interfaceName = `${getApparentNameOfComponent(request, node)}Props`;

	return combineMutations(
		// That interface will be injected with blank lines around it just before the component
		createPropsTypeCreationMutation(
			request,
			node,
			interfaceName,
			attributeTypesAndRequirements,
		),
		// We'll also annotate the component with a type declaration to use the new prop type
		createPropsTypeUsageMutation(node, interfaceName),
	);
};

const collectComponentAttributeTypes = (
	request: FileMutationsRequest,
	node: ReactComponentNode,
) => {
	// Find all references to the node, if there are more than just the node itself
	const references = request.fileInfoCache.getNodeReferencesAsNodes(
		node.parent.kind === ts.SyntaxKind.VariableDeclaration ? node.parent : node,
	);
	if (references === undefined || references.length === 0) {
		return undefined;
	}

	const allAttributeNames = new Set<string>();
	const allAttributeNameUses: Set<string>[] = [];
	const attributeTypes = new Map<string, ts.Type[]>();

	// For each reference, try to collect attribute type from its usage...
	for (const reference of references) {
		// ...assuming the reference is a JSX element used with attributes
		const attributesElement = getAttributesElement(reference);
		if (attributesElement === undefined) {
			continue;
		}

		// Keep track of attribute names that are used, so later we can figure out which are optional
		const usedAttributeNames: string[] = [];

		for (const attribute of attributesElement.attributes.properties) {
			// Only look at JSX attributes, like prop={value} and prop
			if (!ts.isJsxAttribute(attribute)) {
				continue;
			}

			// Attempt to retrieve the type of the prop's value
			const typeChecker = request.services.program.getTypeChecker();
			const valueType = getAttributeValueType(typeChecker, attribute);
			if (valueType === undefined) {
				continue;
			}

			// Widen literals such as `false` to their primitives such as `boolean`
			const type = typeChecker.getBaseTypeOfLiteralType(valueType);

			// Add the type underneath the attribute name
			const name = ts.isJsxNamespacedName(attribute.name)
				? attribute.name.getText(request.sourceFile)
				: attribute.name.text;
			const types = attributeTypes.get(name);
			if (types === undefined) {
				attributeTypes.set(name, [type]);
			} else {
				types.push(type);
			}

			// Remember the attribute name in all attributes, and in this usage (element)
			allAttributeNames.add(name);
			usedAttributeNames.push(name);
		}

		allAttributeNameUses.push(new Set(usedAttributeNames));
	}

	// Mark only the attributes that appear in every usage as required
	const requiredAttributeNames = new Set(
		Array.from(allAttributeNames).filter((attributeName) =>
			allAttributeNameUses.every((attributeNameUses) =>
				attributeNameUses.has(attributeName),
			),
		),
	);

	return { attributeTypes, requiredAttributeNames };
};

const getAttributesElement = (reference: ts.Node) => {
	if (!ts.isIdentifier(reference)) {
		return undefined;
	}

	const { parent } = reference;

	if (ts.isJsxElement(parent)) {
		return parent.openingElement;
	}

	if (ts.isJsxSelfClosingElement(parent)) {
		return parent;
	}

	return undefined;
};

const getAttributeValueType = (
	typeChecker: ts.TypeChecker,
	attribute: ts.JsxAttribute,
) => {
	if (attribute.initializer) {
		if (ts.isStringLiteral(attribute.initializer)) {
			return typeChecker.getTypeAtLocation(attribute);
		}

		return ts.isJsxExpression(attribute.initializer) &&
			attribute.initializer.expression
			? typeChecker.getTypeAtLocation(attribute.initializer.expression)
			: undefined;
	}

	return typeChecker.getTypeAtLocation(attribute.name);
};

interface AttributeTypesAndRequirements {
	attributeTypes: Map<string, ts.Type[]>;
	requiredAttributeNames: Set<string>;
}

const createPropsTypeCreationMutation = (
	request: FileMutationsRequest,
	node: ReactComponentNode,
	interfaceName: string,
	{ attributeTypes, requiredAttributeNames }: AttributeTypesAndRequirements,
) => {
	const endline = printNewLine(request.options.compilerOptions);

	return {
		insertion: [
			endline,
			`interface ${interfaceName} {`,
			...Array.from(attributeTypes).map(
				([name, type]) =>
					`${name}${
						requiredAttributeNames.has(name) ? "" : "?"
					}: ${request.services.printers.type(type)};`,
			),
			`}`,
		].join(endline),
		range: {
			begin: ts.isClassDeclaration(node)
				? node.pos
				: ts.isVariableDeclaration(node.parent)
				? node.parent.parent.pos
				: node.parent.pos,
		},
		type: "text-insert",
	};
};

const createPropsTypeUsageMutation = (
	node: ReactComponentNode,
	interfaceName: string,
) => {
	return ts.isFunctionLike(node)
		? {
				insertion: `: ${interfaceName}`,
				range: {
					begin: node.parameters[0].end,
				},
				type: "text-insert",
		  }
		: {
				insertion: `<${interfaceName}>`,
				range: {
					begin: node.heritageClauses[0].end,
				},
				type: "text-insert",
		  };
};
