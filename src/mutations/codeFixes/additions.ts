import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

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

    return {
        insertion: `: ${textChanges[0].newText.substring(": ".length)}`,
        range: {
            begin: textChanges[0].span.start,
        },
        type: "text-insert",
    };
};
