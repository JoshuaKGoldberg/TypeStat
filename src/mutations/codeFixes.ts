import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { createTypescriptTypeCreationMutation } from "./typescript";

/**
 * Error codes for the TypeScript language service to get --noImplicitAny code fixes.
 */
enum NoImplicitAnyErrorCode {
    Parameter = 7006,
    Variable = 7005,
}

/**
 * Uses a requesting language service to get --noImplicitAny code fixes for a type of node.
 * 
 * @param node   Requesting node to retrieve fixes on.
 * @param request   Source file, metadata, and settings to collect mutations in the file.
 * @param errorCode   Corresponding error code for the node type to retrieve fixes for.
 */
export const getNoImplicitAnyCodeFixes = (node: ts.ParameterDeclaration | ts.VariableDeclaration, request: FileMutationsRequest) =>
    request.services.languageService.getCodeFixesAtPosition(
        request.sourceFile.fileName,
        node.getStart(request.sourceFile),
        node.end,
        [
            ts.isParameter(node)
                ? NoImplicitAnyErrorCode.Parameter
                : NoImplicitAnyErrorCode.Variable
        ],
        {
            insertSpaceBeforeAndAfterBinaryOperators: true,
        },
        {}
    );

/**
 * Attempts to convert a language service code fix into a usable mutation.
 * 
 * @param fixes   Code fix actions from a language service.
 * @returns Equivalent mutation, if possible.
 */
export const createCodeFixAdditionMutation = (fixes: ReadonlyArray<ts.CodeFixAction>): ITextInsertMutation | undefined => {
    if (fixes.length === 0) {
        return undefined;
    }

    const { changes } = fixes[0];
    if (changes.length === 0) {
        return undefined;
    }

    const { textChanges } = changes[0];
    if (textChanges.length === 0) {
        return undefined;
    }

    return createTypescriptTypeCreationMutation(textChanges[0].span.start, textChanges[0].newText.substring(": ".length));
};
