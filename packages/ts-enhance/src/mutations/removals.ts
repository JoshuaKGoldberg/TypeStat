import { TextDeleteMutation } from "automutate";

import { FileMutationsRequest } from "../shared/fileMutator.js";
import { NodeWithType } from "../shared/nodeTypes.js";

export const createTypeRemovalMutation = (
	request: FileMutationsRequest,
	node: NodeWithType,
): TextDeleteMutation => {
	return {
		range: {
			begin:
				node.type.getStart(request.sourceFile) -
				node.type.getLeadingTriviaWidth(request.sourceFile) -
				1,
			end: node.type.end,
		},
		type: "text-delete",
	};
};
