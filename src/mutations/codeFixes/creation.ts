import { combineMutations, MultipleMutations, TextInsertMutation } from "automutate";
import * as ts from "typescript";
import { FileMutationsRequest } from "../../shared/fileMutator";

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
    request: FileMutationsRequest,
    codeFixes: ReadonlyArray<ts.CodeFixAction>,
    preferences: CodeFixCreationPreferences = {},
): MultipleMutations | undefined => {
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

    const simplifiedTextChanges = simplifyTextChanges(textChanges);
    if (simplifiedTextChanges === undefined) {
        return undefined;
    }

    return combineMutations(
        ...simplifiedTextChanges.map(
            (textChange): TextInsertMutation => ({
                insertion: textChange.newText,
                range: {
                    begin: textChange.span.start,
                },
                type: "text-insert",
            }),
        ),
    );
};

/**
 * Reduces TypeScript-suggested text changes to their simplest form,
 * for the case of two text changes with the same span start
 * @see https://github.com/JoshuaKGoldberg/TypeStat/issues/256
 */
const simplifyTextChanges = (textChanges: readonly ts.TextChange[]) => {
    if (textChanges.length === 0 || isOnlyParenthesis(textChanges)) {
        return undefined;
    }

    return textChanges.slice(1).reduce(
        (previousValues, textChange) => {
            const previousValue = previousValues[previousValues.length - 1];

            // If the span starts aren't the same, there's nothing we can simplify
            if (previousValue.span.start !== textChange.span.start) {
                return [...previousValues, textChange];
            }

            // Since two text changes in a row have the same start, rejoice!
            // We can combine them into a single value and lessen the array size
            previousValues[previousValues.length - 1] = {
                ...previousValue,
                newText: `${previousValue.newText}${textChange.newText}`,
            };

            return previousValues;
        },
        [textChanges[0]],
    );
};

const isOnlyParenthesis = (textChanges: readonly ts.TextChange[]) =>
    textChanges.length === 2 && textChanges[0].newText === "(" && textChanges[1].newText === ")";
