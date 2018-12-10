import { ITextInsertMutation } from "automutate";

import { NodeWithAddableType } from "../../../shared/nodeTypes";

// TODO: HOW DOES THIS WORK?
// Will TypeScript consider them to be JSDoced?

export const createJavaScriptTypeAdditionMutation = (
    node: NodeWithAddableType,
    newTypeAlias: string,
): ITextInsertMutation => {
    return {
        insertion: ` | ${newTypeAlias}`,
        range: {
            begin: node.type.end,
        },
        type: "text-insert",
    }
};
