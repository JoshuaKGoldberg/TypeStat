import { combineMutations, IMultipleMutations, ITextInsertMutation } from "automutate";
import * as ts from "typescript";

/**
 * Attempts to convert a language service code fix into a usable mutation.
 *
 * @param codeFixes   Code fixes  from a language service.
 * @returns Equivalent mutation, if possible.
 */
export const createCodeFixCreationMutation = (codeFixes: ReadonlyArray<ts.CodeFixAction>): IMultipleMutations | undefined => {
    if (codeFixes.length === 0) {
        return undefined;
    }

    const { changes } = codeFixes[0];
    if (changes.length === 0) {
        return undefined;
    }

    const { textChanges } = changes[0];
    if (textChanges.length === 0) {
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
