import { combineMutations, IMultipleMutations, ITextInsertMutation } from "automutate";
import * as ts from "typescript";

export interface CodeFixCreationPreferences {
    ignoreKnownBlankTypes?: boolean;
}

const knownBlankTypes = new Set([": {}", ": any", ": never", ": null", ": Object", ": unknown"]);

/**
 * Attempts to convert a language service code fix into a usable mutation.
 *
 * @param codeFixes   Code fixes  from a language service.
 * @returns Equivalent mutation, if possible.
 */
export const createCodeFixCreationMutation = (
    codeFixes: readonly ts.CodeFixAction[],
    preferences: CodeFixCreationPreferences = {},
): IMultipleMutations | undefined => {
    if (codeFixes.length === 0) {
        return undefined;
    }

    const { changes } = codeFixes[0];
    if (changes.length === 0) {
        return undefined;
    }

    let { textChanges } = changes[0];

    if (preferences.ignoreKnownBlankTypes) {
        textChanges = textChanges.filter((textChange) => !knownBlankTypes.has(textChange.newText));
    }

    if (textChanges.length === 0 || isOnlyParenthesis(textChanges)) {
        return undefined;
    }

    return combineMutations(
        ...textChanges.map(
            (textChange): ITextInsertMutation => ({
                insertion: textChange.newText,
                range: {
                    begin: textChange.span.start,
                },
                type: "text-insert",
            }),
        ),
    );
};

const isOnlyParenthesis = (textChanges: ts.TextChange[]) =>
    textChanges.length === 2 && textChanges[0].newText === "(" && textChanges[1].newText === ")";
