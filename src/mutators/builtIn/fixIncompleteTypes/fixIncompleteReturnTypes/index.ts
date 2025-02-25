import { Mutation } from "automutate";
import * as tsutils from "ts-api-utils";
import ts from "typescript";

import { joinIntoType } from "../../../../mutations/aliasing/joinIntoType.js";
import {
	collectRawTypesFromTypes,
	findMissingTypes,
} from "../../../../mutations/collecting.js";
import { createTypeAdditionMutation } from "../../../../mutations/creators.js";
import { textSwap } from "../../../../mutations/text-mutations.js";
import { isNotUndefined } from "../../../../shared/arrays.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import {
	FunctionLikeDeclarationWithType,
	isNodeWithType,
} from "../../../../shared/nodeTypes.js";
import {
	getTypeAtLocationIfNotError,
	isTypeBuiltIn,
} from "../../../../shared/types.js";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes.js";
import { collectReturningNodeExpressions } from "../../fixStrictNonNullAssertions/fixStrictNonNullAssertionReturnTypes/collectReturningNodeExpressions.js";

export const fixIncompleteReturnTypes: FileMutator = (
	request: FileMutationsRequest,
): readonly Mutation[] =>
	collectMutationsFromNodes(
		request,
		isNodeVisitableFunctionLikeDeclaration,
		visitFunctionWithBody,
	);

const isNodeVisitableFunctionLikeDeclaration = (
	node: ts.Node,
): node is FunctionLikeDeclarationWithType =>
	ts.isFunctionLike(node) &&
	// If the node has an implicit return type, we don't need to change anything
	isNodeWithType(node);

const visitFunctionWithBody = (
	node: FunctionLikeDeclarationWithType,
	request: FileMutationsRequest,
) => {
	// Collect the type initially declared as returned
	const declaredType = getTypeAtLocationIfNotError(request, node.type);
	if (declaredType === undefined || tsutils.isIntrinsicAnyType(declaredType)) {
		return undefined;
	}

	// Collect types of nodes returned by the function
	const returnedTypes = collectReturningNodeExpressions(node)
		.map((node) => getTypeAtLocationIfNotError(request, node))
		.filter(isNotUndefined);

	const isAsyncFunction = node.modifiers?.some((modifier) =>
		tsutils.isAsyncKeyword(modifier),
	);

	if (isAsyncFunction) {
		const returnType = getReturnTypeForAsyncFunction(
			declaredType,
			returnedTypes,
			request,
		);

		if (returnType) {
			return textSwap(returnType, node.type.pos, node.type.end);
		} else {
			return undefined;
		}
	}

	// Add later-returned types to the node's type declaration if necessary
	return createTypeAdditionMutation(request, node, declaredType, returnedTypes);
};

/**
 * Async function's return type needs to be global Promise.
 * It can't be `Promise<boolean> | Promise<string>`, but instead it needs to be `Promise<boolean | string>`.
 * This function tries to collect all type arguments needed and then it wraps those inside `Promise`.
 */
const getReturnTypeForAsyncFunction = (
	declaredType: ts.Type,
	returnedTypes: ts.Type[],
	request: FileMutationsRequest,
): string | undefined => {
	const typeChecker = request.services.program.getTypeChecker();

	const declaredTypes = getRawUnwrappedTypes(
		[declaredType],
		request,
		typeChecker,
	);

	const rawUnwrappedAssigned = getRawUnwrappedTypes(
		returnedTypes,
		request,
		typeChecker,
	);

	// Subtract the above to find any types assigned but not declared
	const missingTypes = findMissingTypes(
		request,
		rawUnwrappedAssigned,
		declaredTypes,
	);

	// If nothing is missing, rejoice! The type was already fine.
	if (missingTypes.size === 0) {
		return undefined;
	}

	// Join the missing types into a type string to declare
	const newTypeAlias = joinIntoType(
		new Set([...declaredTypes, ...missingTypes]),
		request,
	);

	return ` Promise<${newTypeAlias}>`;
};

/** Unwraps promises to their type arguments and collects all of those types together. */
const getRawUnwrappedTypes = (
	startingTypes: readonly ts.Type[],
	request: FileMutationsRequest,
	typeChecker: ts.TypeChecker,
): Set<ts.Type> => {
	const raw = collectRawTypesFromTypes(request, startingTypes);
	const unwrapped = getUnwrappedTypes(raw, typeChecker);
	const rawFromUnwrapped = collectRawTypesFromTypes(request, unwrapped);
	return rawFromUnwrapped;
};

/** If type is Promise, return its type arguments. Otherwise, use original type. */
const getUnwrappedTypes = (
	types: Set<ts.Type>,
	typeChecker: ts.TypeChecker,
): ts.Type[] => {
	return [...types]
		.flatMap((type) => {
			const startsWithPromise = typeChecker
				.typeToString(typeChecker.getBaseTypeOfLiteralType(type))
				.startsWith("Promise<");

			if (
				startsWithPromise &&
				isTypeBuiltIn(type) &&
				tsutils.isTypeReference(type)
			) {
				return type.typeArguments;
			} else {
				return type;
			}
		})
		.filter((x) => !!x);
};
