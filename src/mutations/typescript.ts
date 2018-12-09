import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

export const createTypescriptTypeAdditionMutation = (
    typeNode: ts.TypeNode,
    newTypeAlias: string,
): ITextInsertMutation => {
    return {
        insertion: ` | ${newTypeAlias}`,
        range: {
            begin: typeNode.end,
        },
        type: "text-insert",
    }
}

export const createTypescriptTypeCreationMutation = (
    begin: number,
    newTypeAlias: string,
): ITextInsertMutation => {
    return {
        insertion: `: ${newTypeAlias}`,
        range: {
            begin,
        },
        type: "text-insert",
    }
}