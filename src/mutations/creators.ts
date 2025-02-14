import { TextInsertMutation, TextSwapMutation } from "automutate";
import * as tsutils from "ts-api-utils";
import ts from "typescript";

import { FileMutationsRequest } from "../shared/fileMutator.js";
import {
	isKnownGlobalBaseType,
	NodeWithAddableType,
	NodeWithCreatableType,
} from "../shared/nodeTypes.js";
import { joinIntoType } from "./aliasing/joinIntoType.js";
import { collectUsageSymbols } from "./collecting.js";
import { textInsert, textSwap } from "./text-mutations.js";

/**
 * Creates a mutation to add types to an existing type, if any are new.
 * @param request Source file, metadata, and settings to collect mutations in the file.
 * @param node Original node with a type declaration to add to.
 * @param declaredType Declared type from the node.
 * @param allAssignedTypes Types now assigned to the node.
 * @returns Mutation to add any new assigned types, if any are missing from the declared type.
 */
export const createTypeAdditionMutation = (
	request: FileMutationsRequest,
	node: NodeWithAddableType,
	declaredType: ts.Type,
	allAssignedTypes: readonly ts.Type[],
): TextInsertMutation | TextSwapMutation | undefined => {
	// Declared 'any' types inherently can't be incomplete
	if (tsutils.isIntrinsicAnyType(declaredType)) {
		return undefined;
	}

	// Find any missing symbols (a.k.a. types)
	const { missingTypes } = collectUsageSymbols(
		request,
		declaredType,
		allAssignedTypes,
	);

	// If nothing is missing, rejoice! The type was already fine.
	if (missingTypes.size === 0) {
		return undefined;
	}

	// Join the missing types into a type string to declare
	const newTypeAlias = joinIntoType(missingTypes, request);

	// If the original type was a bottom type or just something like Function or Object, replace it entirely
	if (
		tsutils.isTypeFlagSet(
			declaredType,
			ts.TypeFlags.Never | ts.TypeFlags.Unknown,
		) ||
		isKnownGlobalBaseType(declaredType)
	) {
		return textSwap(` ${newTypeAlias}`, node.type.pos, node.type.end);
	}

	const typeChecker = request.services.languageService
		.getProgram()
		?.getTypeChecker();

	const declaredTypeAsString = typeChecker?.typeToString(declaredType);

	// There must be better way to check if the type is Promise or includes Promise,
	// but it's hard to find right flags for it.
	// So we are just checking if the string includes mention of Promise
	if (!declaredTypeAsString?.includes("Promise")) {
		// Create a mutation insertion that adds the missing types in
		return textInsert(` | ${newTypeAlias}`, node.type.end);
	}

	const typesAsPromises = new Set(
		[...missingTypes].map((type) => {
			const stringified = typeChecker?.typeToString(
				typeChecker.getBaseTypeOfLiteralType(type),
			);
			return stringified?.startsWith("Promise<")
				? stringified
				: `Promise<${stringified}>`;
		}),
	);

	const combined = [...typesAsPromises].join(" | ");

	// After adding Promise wrappers, it may be that the type is same as in original
	if (combined === declaredTypeAsString) {
		return undefined;
	}

	// Create a mutation insertion that adds the missing types in
	return textInsert(` | ${combined}`, node.type.end);
};

/**
 * Creates a mutation to add types to a node without a type, if any are new.
 * @param request Metadata and settings to collect mutations in a file.
 * @param node Node to add the type annotation.
 * @param declaredType Declared type from the node.
 * @param allAssignedTypes Types now assigned to the node.
 * @returns Mutation to add any new assigned types, if any are missing from the declared type.
 */
export const createTypeCreationMutation = (
	request: FileMutationsRequest,
	node: NodeWithCreatableType,
	declaredType: ts.Type,
	allAssignedTypes: readonly ts.Type[],
): TextInsertMutation | undefined => {
	// Find the already assigned symbols, as well as any missing ones
	const { assignedTypes, missingTypes } = collectUsageSymbols(
		request,
		declaredType,
		allAssignedTypes,
	);

	// If nothing is missing, rejoice! The type was already fine.
	if (missingTypes.size === 0) {
		return undefined;
	}

	// Join the missing types into a type string to declare
	const newTypeAlias = joinIntoType(assignedTypes, request);

	// Create a mutation insertion that adds the assigned types in
	return textInsert(`: ${newTypeAlias}`, node.name.end);
};
