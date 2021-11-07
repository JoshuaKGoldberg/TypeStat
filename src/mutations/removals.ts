import { TextDeleteMutation } from "automutate";

import { NodeWithType } from "../shared/nodeTypes";
import { FileMutationsRequest } from "../mutators/fileMutator";

export const createTypeRemovalMutation = (request: FileMutationsRequest, node: NodeWithType): TextDeleteMutation => {
    return {
        range: {
            begin: node.type.getStart(request.sourceFile) - node.type.getLeadingTriviaWidth(request.sourceFile) - 1,
            end: node.type.end,
        },
        type: "text-delete",
    };
};
