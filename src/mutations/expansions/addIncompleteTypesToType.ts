import { combineMutations, IMutation, ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { createTypeName } from "../aliasing";

import { TypeSummary } from "./summarization";

export type TypeSummariesPerNodeByName = Map<string, TypeSummaryWithNode>;

export interface TypeSummaryWithNode {
    summary: TypeSummary;
    originalProperty: ts.PropertySignature;
}

export const addIncompleteTypesToType = (
    request: FileMutationsRequest,
    incompleteTypes: TypeSummariesPerNodeByName,
): IMutation | undefined => {
    const mutations: ITextInsertMutation[] = [];

    for (const { originalProperty, summary } of incompleteTypes.values()) {
        mutations.push(fillInIncompleteType(request, originalProperty, summary.types));
    }

    return mutations.length === 0 ? undefined : combineMutations(...mutations);
};

const fillInIncompleteType = (request: FileMutationsRequest, memberNode: ts.PropertySignature, types: ts.Type[]): ITextInsertMutation => {
    const begin = memberNode.type === undefined ? memberNode.name.end : memberNode.type.end;

    return {
        insertion: `| ${createTypeName(request, ...types)}`,
        range: { begin },
        type: "text-insert",
    };
};
