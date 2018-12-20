import { ITextInsertMutation } from "automutate";

import { NodeWithAddableType } from "../../../shared/nodeTypes";

export const createTypescriptTypeAdditionMutation = (node: NodeWithAddableType, newTypeAlias: string): ITextInsertMutation => {
    return {
        insertion: ` | ${newTypeAlias}`,
        range: {
            begin: node.type.end,
        },
        type: "text-insert",
    };
};
