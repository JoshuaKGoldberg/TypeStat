import { combineMutations, IMutation, ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { TypeSummary } from "./summarization";

export type TypeSummariesPerNodeByName = Map<string, TypeSummaryWithNode>;

export interface TypeSummaryWithNode {
    summary: TypeSummary;
    originalProperty: ts.PropertySignature;
}

export const addIncompleteTypesToType = (incompleteTypes: TypeSummariesPerNodeByName): IMutation | undefined => {
    const mutations: ITextInsertMutation[] = [];

    for (const { originalProperty, summary } of incompleteTypes.values()) {
        mutations.push(fillInIncompleteType(originalProperty, summary.types));
    }

    return mutations.length === 0 ? undefined : combineMutations(...mutations);
};

/**
 *
 * @todo Extract aliasing logic from `src/mutations/aliasing.ts`
 */
const fillInIncompleteType = (memberNode: ts.PropertySignature, types: ts.Type[]): ITextInsertMutation => {
    const begin = memberNode.type === undefined ? memberNode.name.end : memberNode.type.end;

    return {
        insertion: `| ${types.join(" | ")}`,
        range: { begin },
        type: "text-insert",
    };
};
