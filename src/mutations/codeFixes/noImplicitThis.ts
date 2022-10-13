import { Mutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

import { createCodeFixCreationMutation } from "./creation";
import { getCodeFixIfMatchedByDiagnostic } from "./getCodeFixIfMatchedByDiagnostic";

/**
 * Error code for the TypeScript language service to get --noImplicitThis code fixes.
 */
const noImplicitThisErrorCodes = [2683];

export const getNoImplicitThisMutations = (node: ts.ThisExpression, request: FileMutationsRequest): Mutation | undefined => {
    // Create a mutation for the code fixes if anything is available
    const codeFixes = getCodeFixIfMatchedByDiagnostic(request, node, noImplicitThisErrorCodes);

    return !codeFixes?.length ? undefined : createCodeFixCreationMutation(request, codeFixes);
};
