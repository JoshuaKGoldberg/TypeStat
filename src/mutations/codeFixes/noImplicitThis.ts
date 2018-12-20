import { IMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { createCodeFixCreationMutation } from "./creation";

/**
 * Error code for the TypeScript language service to get --noImplicitThis code fixes.
 */
const noImplicitThisErrorCode = 2683;

export const canNodeBeFixedForNoImplicitThis = (node: ts.FunctionDeclaration, sourceFile: ts.SourceFile) =>
    node.parameters.length !== 0 && node.parameters[0].getText(sourceFile) === "this";

export const getNoImplicitThisMutations = (node: ts.FunctionDeclaration, request: FileMutationsRequest): IMutation | undefined => {
    // If we the node can't be given --noImplicitThis fixes, that's easier: bail out early
    if (!canNodeBeFixedForNoImplicitThis(node, request.sourceFile)) {
        return undefined;
    }

    // Create a mutation for the code fixes if anything is available
    const codeFixes = getNoImplicitThisCodeFixes(node, request);

    return codeFixes.length === 0 ? undefined : createCodeFixCreationMutation(codeFixes);
};

/**
 * Uses a requesting language service to get --noImplicitThis code fixes for a type of node.
 *
 * @param node   Requesting node to retrieve fixes on.
 * @param request   Source file, metadata, and settings to collect mutations in the file.
 * @param errorCode   Corresponding error code for the node type to retrieve fixes for.
 */
const getNoImplicitThisCodeFixes = (node: ts.FunctionDeclaration, request: FileMutationsRequest) =>
    request.services.languageService.getCodeFixesAtPosition(
        request.sourceFile.fileName,
        node.getStart(request.sourceFile),
        node.end,
        [noImplicitThisErrorCode],
        {
            insertSpaceBeforeAndAfterBinaryOperators: true,
        },
        {},
    );
