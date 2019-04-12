import { combineMutations, IMutation, ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { TypesAndNodesByName } from "./eliminations";

export const addIncompleteTypesToType = (incompleteTypes: TypesAndNodesByName): IMutation => {
    const mutations: ITextInsertMutation[] = [];

    for (const { memberNode, types } of incompleteTypes.values()) {
        mutations.push(fillInIncompleteType(memberNode, types));
    }

    return combineMutations(...mutations);
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
