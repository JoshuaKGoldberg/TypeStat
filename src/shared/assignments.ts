import ts from "typescript";

import { FileMutationsRequest } from "./fileMutator.js";
import { getValueDeclarationOfFunction } from "./functionTypes.js";
import { getTypeAtLocationIfNotError } from "./types.js";

/**
 * Given a node passed to a location with a declared, known type,
 * attempts to find that known type.
 * @example
 * If the node is assigned to a variable, this would return that variable's type.
 * In this case, that would be `Record&lt;string, string>`:
 *
 * ```ts
 * const value: Record&lt;string, string> = {};
 *                                    // ^^
 * ```
 * @example
 * If the node passed to a function, this would return that variable's type.
 * In this case, that would be `number | null`:
 *
 * ```ts
 * function receivesNumber(value: number | null) { }
 * receivesNumber(3);
 *             // ^
 * ```
 */
export const getManuallyAssignedTypeOfNode = (
	request: FileMutationsRequest,
	node: ts.Node,
) => {
	const { parent } = node;

	if (ts.isCallExpression(parent)) {
		return getAssignedTypeOfParameter(request, node as ts.Expression, parent);
	}

	if (ts.isVariableDeclaration(parent)) {
		return getAssignedTypeOfVariable(request, parent);
	}

	return undefined;
};

const getAssignedTypeOfParameter = (
	request: FileMutationsRequest,
	node: ts.Expression,
	parent: ts.CallExpression,
) => {
	// Collect the declared type of the function-like being called
	const functionLikeValueDeclaration = getValueDeclarationOfFunction(
		request,
		parent.expression,
	);
	if (functionLikeValueDeclaration === undefined) {
		return undefined;
	}

	// Don't bother checking for an out-of-range parameter
	const argumentIndex = parent.arguments.indexOf(node);
	if (argumentIndex >= functionLikeValueDeclaration.parameters.length) {
		return undefined;
	}

	return getTypeAtLocationIfNotError(
		request,
		functionLikeValueDeclaration.parameters[argumentIndex],
	);
};

const getAssignedTypeOfVariable = (
	request: FileMutationsRequest,
	node: ts.VariableDeclaration,
) => {
	if (node.type === undefined) {
		return undefined;
	}

	return request.services.program
		.getTypeChecker()
		.getTypeFromTypeNode(node.type);
};
