import { TextInsertMutation } from "automutate";
import ts from "typescript";

import { getClassExtendsType } from "../../../../../../shared/nodes.js";
import {
	ReactClassComponentNode,
	ReactComponentNode,
	ReactFunctionalComponentNode,
} from "../../reactFiltering/isReactComponentNode.js";

export const createInterfaceUsageMutation = (
	node: ReactComponentNode,
	interfaceName: string,
): TextInsertMutation | undefined => {
	return ts.isClassLike(node)
		? createClassInterfaceUsageMutation(node, interfaceName)
		: createFunctionLikeInterfaceUsageMutation(node, interfaceName);
};

const createClassInterfaceUsageMutation = (
	node: ReactClassComponentNode,
	interfaceName: string,
): TextInsertMutation | undefined => {
	const extension = getClassExtendsType(node);
	if (extension === undefined) {
		return undefined;
	}

	return {
		insertion: `<${interfaceName}>`,
		range: {
			begin: extension.end,
		},
		type: "text-insert",
	};
};

const createFunctionLikeInterfaceUsageMutation = (
	node: ReactFunctionalComponentNode,
	interfaceName: string,
): TextInsertMutation => {
	const propsArgument = node.parameters[0];

	return {
		insertion: `: ${interfaceName}`,
		range: {
			begin: propsArgument.end,
		},
		type: "text-insert",
	};
};
