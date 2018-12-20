import { ITextInsertMutation } from "automutate";

import { NodeWithCreatableType } from "../../../shared/nodeTypes";

export const createTypescriptTypeCreationMutation = (node: NodeWithCreatableType, newTypeAlias: string): ITextInsertMutation => {
    return {
        insertion: `: ${newTypeAlias}`,
        range: {
            begin: node.name.end,
        },
        type: "text-insert",
    };
};
