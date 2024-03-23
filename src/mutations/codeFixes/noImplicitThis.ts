import { Mutation } from "automutate";
import ts from "typescript";

import { FileMutationsRequest } from "../../shared/fileMutator.js";
import { createCodeFixCreationMutation } from "./creation.js";
import { getCodeFixIfMatchedByDiagnostic } from "./getCodeFixIfMatchedByDiagnostic.js";

/**
 * Error code for the TypeScript language service to get --noImplicitThis code fixes.
 */
const noImplicitThisErrorCodes = [2683];

export const getNoImplicitThisMutations = (
	node: ts.ThisExpression,
	request: FileMutationsRequest,
): Mutation | undefined => {
	// Create a mutation for the code fixes if anything is available
	const codeFixes = getCodeFixIfMatchedByDiagnostic(
		request,
		node,
		noImplicitThisErrorCodes,
	);

	return !codeFixes?.length
		? undefined
		: createCodeFixCreationMutation(codeFixes);
};
