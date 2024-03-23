import { Mutation } from "automutate";
import ts from "typescript";

import { FileMutationsRequest } from "../../shared/fileMutator.js";
import { createCodeFixCreationMutation } from "./creation.js";

/**
 * Error code for the TypeScript language service to add a missing property.
 */
const fixMissingPropertyErrorCode = 2339;

export const getMissingPropertyMutations = (
	request: FileMutationsRequest,
	node: ts.PropertyAccessExpression,
): Mutation | undefined => {
	// Skip nodes that aren't setting a member of a `this` node
	if (!nodeIsSettingThisMember(node)) {
		return undefined;
	}

	const codeFixes = getMissingPropertyCodeFixes(node, request);
	if (codeFixes.length === 0) {
		return undefined;
	}

	return createCodeFixCreationMutation(codeFixes);
};

/**
 * @returns Whether a property access is setting a 'this' member.
 */
const nodeIsSettingThisMember = (node: ts.PropertyAccessExpression): boolean =>
	ts.isBinaryExpression(node.parent) &&
	node.parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
	node.expression.kind === ts.SyntaxKind.ThisKeyword;

/**
 * Uses a requesting language service to get missing property code fixes for a type of node.
 */
const getMissingPropertyCodeFixes = (
	node: ts.PropertyAccessExpression,
	request: FileMutationsRequest,
) =>
	request.services.languageService.getCodeFixesAtPosition(
		request.sourceFile.fileName,
		node.name.getStart(request.sourceFile),
		node.end,
		[fixMissingPropertyErrorCode],
		{
			insertSpaceBeforeAndAfterBinaryOperators: true,
		},
		{},
	);
