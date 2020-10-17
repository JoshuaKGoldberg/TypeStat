import { IMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

import { createCodeFixCreationMutation } from "./creation";
import { processCodeFixActions } from "./processCodeFixActions";

/**
 * Error code for the TypeScript language service to get --noImplicitThis code fixes.
 */
const noImplicitThisErrorCode = 2683;

export const getNoImplicitThisMutations = (node: ts.ThisExpression, request: FileMutationsRequest): IMutation | undefined => {
    // Create a mutation for the code fixes if anything is available
    const codeFixes = getNoImplicitThisCodeFixes(node, request);

    return codeFixes.length === 0 ? undefined : createCodeFixCreationMutation(request, codeFixes);
};

/**
 * Uses a requesting language service to get --noImplicitThis code fixes for a type of node.
 *
 * @param node   Requesting node to retrieve fixes on.
 * @param request   Source file, metadata, and settings to collect mutations in the file.
 */
const getNoImplicitThisCodeFixes = (node: ts.ThisExpression, request: FileMutationsRequest) =>
    processCodeFixActions(
        request,
        request.services.languageService.getCodeFixesAtPosition(
            request.sourceFile.fileName,
            node.getStart(request.sourceFile),
            node.end,
            [noImplicitThisErrorCode],
            {},
            {},
        ),
    );
