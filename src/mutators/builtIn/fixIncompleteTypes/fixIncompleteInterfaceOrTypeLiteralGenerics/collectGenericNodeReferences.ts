import ts from "typescript";

import { FileMutationsRequest } from "../../../../shared/fileMutator.js";
import {
	getIdentifyingTypeLiteralParent,
	isNodeWithDefinedTypeArguments,
	isNodeWithDefinedTypeParameters,
	isNodeWithIdentifierName,
} from "../../../../shared/nodeTypes.js";
import { isTypeArgumentsType } from "../../../../shared/typeNodes.js";
import { getTypeAtLocationIfNotError } from "../../../../shared/types.js";

export type InterfaceOrTypeLiteral =
	| ts.InterfaceDeclaration
	| ts.TypeLiteralNode;

export const collectGenericNodeReferences = (
	request: FileMutationsRequest,
	node: InterfaceOrTypeLiteral,
) => {
	// Find all generic references purported to be of this type
	const referencingNodes = collectDirectNodeReferences(request, node);
	if (referencingNodes === undefined) {
		return undefined;
	}

	// For any reference that uses the node as a generic type,
	// expand the node's references to include references to that generic type
	return expandReferencesForGenericTypes(request, node, referencingNodes);
};

const collectDirectNodeReferences = (
	request: FileMutationsRequest,
	node: InterfaceOrTypeLiteral,
) => {
	// Interfaces are referenced by themselves, as they provide their own name
	// Type literals are referenced by their parent, which is often a type alias or variable
	const identifyingNode = ts.isInterfaceDeclaration(node)
		? node
		: getIdentifyingTypeLiteralParent(node);

	return request.fileInfoCache.getNodeReferencesAsNodes(identifyingNode);
};

export const expandReferencesForGenericTypes = (
	request: FileMutationsRequest,
	interfaceOrTypeLiteral: InterfaceOrTypeLiteral,
	referencingNodes: readonly ts.Node[],
) => {
	const expandedReferences: ts.Node[] = [];

	// For each of the references we'll look at, there are two relevant nodes we need to map together:
	// * The templated declaration with type parameters: e.g. class Container<T> { ... }
	// * The templated instantiation with type arguments: e.g. new Container<T>() { ... }
	for (const referencingNode of referencingNodes) {
		// We only care about type references within generics
		if (!ts.isTypeReferenceNode(referencingNode)) {
			continue;
		}

		// Nodes with a "typeArguments" are the only ones we care about
		const templatedParentInstantiation = referencingNode.parent;
		if (!isNodeWithDefinedTypeArguments(templatedParentInstantiation)) {
			continue;
		}

		// Find the corresponding type node in the templated parent's type arguments
		// Note that call expressions (e.g. `container<T>({})`) store the type in the expression (e.g. `container`),
		// while other types (e.g. `container.value = {};`) store the type on themselves
		const relevantNodeWithTypeSignatures = ts.isCallExpression(
			templatedParentInstantiation,
		)
			? templatedParentInstantiation.expression
			: templatedParentInstantiation;
		const templatedDeclarationSymbol = getTypeAtLocationIfNotError(
			request,
			relevantNodeWithTypeSignatures,
		)?.getSymbol();
		if (templatedDeclarationSymbol === undefined) {
			continue;
		}

		// The templated declaration is the backing value declaration for the instantiation's symbol
		const templatedDeclaration = templatedDeclarationSymbol.valueDeclaration;
		if (
			templatedDeclaration === undefined ||
			!isNodeWithDefinedTypeParameters(templatedDeclaration) ||
			templatedParentInstantiation.typeArguments === undefined ||
			templatedDeclaration.typeParameters === undefined
		) {
			continue;
		}

		// Find the index of the corresponding type argument in the instantiation of the node,
		// and finally use that to grab the node for the template parameter from the type argument's index
		const typeArgumentIndex =
			templatedParentInstantiation.typeArguments.indexOf(referencingNode);
		const templateDeclaredTypeNode =
			templatedDeclaration.typeParameters[typeArgumentIndex];

		// Collect all nodes that are of the template declared type node when its value is
		// the interface or type alias we're considering expanding
		expandedReferences.push(
			...collectGenericReferencesOfType(
				request,
				interfaceOrTypeLiteral,
				templateDeclaredTypeNode,
			),
		);
	}

	return expandedReferences;
};

const collectGenericReferencesOfType = (
	request: FileMutationsRequest,
	interfaceOrTypeLiteral: InterfaceOrTypeLiteral,
	templateDeclaredTypeNode: ts.TypeNode,
) => {
	const genericNodeReferences: ts.Node[] = [];
	const originalType = getTypeAtLocationIfNotError(
		request,
		interfaceOrTypeLiteral,
	);

	// Find all the references to the declared template type within its declaration
	// For example, in `class Container<T> { member: T; }`, that would be the T in `member: T;`
	const referencingTypeNodes = request.fileInfoCache.getNodeReferencesAsNodes(
		templateDeclaredTypeNode,
	);
	if (referencingTypeNodes === undefined) {
		return genericNodeReferences;
	}

	for (const referencingTypeNode of referencingTypeNodes) {
		// From the referencing type node, grab the node it's declared as the type of
		if (!ts.isTypeNode(referencingTypeNode)) {
			continue;
		}

		// The parent node of the referencing type node will typically be something like a parameter or variable declaration
		// For example, in `class Container<T> { member: T; }`, that would be the `member: T;`
		const parent = referencingTypeNode.parent;
		if (!isNodeWithIdentifierName(parent)) {
			continue;
		}

		// Try finding all references to the name of the parent (declaration)
		// For example, if the parent is `member: T;`, that would be `member`
		const allReferencingInstantiationNodes =
			request.fileInfoCache.getNodeReferencesAsNodes(parent.name);
		if (allReferencingInstantiationNodes !== undefined) {
			for (const referencingInstantiationNode of allReferencingInstantiationNodes) {
				if (
					getTypeAtLocationIfNotError(request, referencingInstantiationNode) ===
					originalType
				) {
					genericNodeReferences.push(referencingInstantiationNode);
				}
			}
		}

		// If the is a parameter, try all objects passed into its containing signature
		if (
			ts.isParameter(parent) ||
			ts.isParameterPropertyDeclaration(parent, parent.parent)
		) {
			genericNodeReferences.push(
				...findProvidedTypesForParameter(
					request,
					interfaceOrTypeLiteral,
					parent.parent,
					parent,
				),
			);
		}
	}

	return genericNodeReferences;
};

const findProvidedTypesForParameter = (
	request: FileMutationsRequest,
	interfaceOrTypeLiteral: InterfaceOrTypeLiteral,
	signature: ts.SignatureDeclaration,
	parameter: ts.ParameterDeclaration | ts.ParameterPropertyDeclaration,
) => {
	const providedNodes: ts.Node[] = [];
	const allReferencingNodes =
		request.fileInfoCache.getNodeReferencesAsNodes(signature);
	if (allReferencingNodes === undefined) {
		return providedNodes;
	}

	const originalType = getTypeAtLocationIfNotError(
		request,
		interfaceOrTypeLiteral,
	);
	if (originalType === undefined) {
		return providedNodes;
	}

	const parameterIndex = signature.parameters.indexOf(parameter);

	for (let referencingNode of allReferencingNodes) {
		// Call signatures might be found to be referenced by an expression, e.g. `container<T>({});`
		// We want the call expression within, e.g. `container<T>({})` (note the lack of `;`)
		if (ts.isExpressionStatement(referencingNode)) {
			referencingNode = referencingNode.expression;
		}

		for (const potentialCallOrNewExpression of [
			// Direct call expressions will have arguments on themselves, e.g. `container<T>({})`
			referencingNode,
			// New expressions will have arguments on their parents, e.g. `new Container<T>({})`
			referencingNode.parent,
			// Method expressions will have arguments on their grandparents, e.g. `container.setValues({})`
			referencingNode.parent.parent,
		]) {
			if (!ts.isCallOrNewExpression(potentialCallOrNewExpression)) {
				continue;
			}

			const providedArguments = potentialCallOrNewExpression.arguments;
			if (providedArguments === undefined) {
				continue;
			}

			if (
				expressionRefersToOriginalType(
					request,
					originalType,
					potentialCallOrNewExpression,
				)
			) {
				providedNodes.push(providedArguments[parameterIndex]);
				break;
			}
		}
	}

	return providedNodes;
};

/**
 * Given:
 *  Declaration of a call or construct signature with a type argument (on it or a parent)
 *  Usage of that same signature
 *  An original interface or type literal
 * How can we determine whether the signature usage is on that same type argument?
 * These are definitely not the right ways to do this...
 * ...but I spent three hours wrangling with it and don't know how...
 */
const expressionRefersToOriginalType = (
	request: FileMutationsRequest,
	originalType: ts.Type,
	potentialCallOrNewExpression: ts.CallExpression | ts.NewExpression,
) => {
	const expressionNodeType = getTypeAtLocationIfNotError(
		request,
		potentialCallOrNewExpression,
	);
	if (expressionNodeType === undefined) {
		return false;
	}

	// If the expression node's type already has type arguments, do they match the original type?
	// This is more likely with classes that are instantiated with a type
	// This can go wrong easily: e.g. with multiple type arguments that have intermixed usages
	if (
		isTypeArgumentsType(expressionNodeType) &&
		expressionNodeType.typeArguments.includes(originalType)
	) {
		return true;
	}

	// Alternately, what about functions that themselves have types?
	// Again, this can go wrong: e.g. with multiple type arguments that have intermixed usages
	if (
		isNodeWithDefinedTypeArguments(potentialCallOrNewExpression) &&
		potentialCallOrNewExpression.typeArguments
	) {
		for (const typeArgument of potentialCallOrNewExpression.typeArguments) {
			if (getTypeAtLocationIfNotError(request, typeArgument) === originalType) {
				return true;
			}
		}
	}

	return false;
};
