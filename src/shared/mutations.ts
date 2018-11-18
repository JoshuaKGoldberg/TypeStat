import { ITextInsertMutation } from "automutate";

import { CollectedType, StrictType } from "./types";

/**
 * Creates a mutation to add a strict types as a union to an existing type.
 * 
 * @param begin   Character position to add the type.
 * @param missingTypes   Collected strict types to be added.
 * @param comment   Comment marker to add, if not `false`.
 * @returns Text add mutation for the added union types.
 */
export const createTypeAddMutation = (begin: number, missingTypes: StrictType, comment: false | string): ITextInsertMutation => {
    let insertion = "";

    if (missingTypes & CollectedType.Null) {
        insertion += " | null";
    }

    if (missingTypes & CollectedType.Undefined) {
        insertion += " | undefined";
    }

    if (comment !== false) {
        insertion += ` /* ${comment} */`;
    }

    return {
        insertion,
        range: { begin },
        type: "text-insert",
    };
};
