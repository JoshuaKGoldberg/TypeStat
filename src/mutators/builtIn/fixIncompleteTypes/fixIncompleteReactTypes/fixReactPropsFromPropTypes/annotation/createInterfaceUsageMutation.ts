import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { getClassExtendsType } from "../../../../../../shared/nodes";
import { ReactClassComponentNode, ReactComponentNode, ReactFunctionalComponentNode } from "../../reactFiltering/isReactComponentNode";

export const createInterfaceUsageMutation = (node: ReactComponentNode, interfaceName: string): ITextInsertMutation | undefined => {
    return ts.isClassLike(node)
        ? createClassInterfaceUsageMutation(node, interfaceName)
        : createFunctionLikeInterfaceUsageMutation(node, interfaceName);
};

const createClassInterfaceUsageMutation = (node: ReactClassComponentNode, interfaceName: string): ITextInsertMutation | undefined => {
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

const createFunctionLikeInterfaceUsageMutation = (node: ReactFunctionalComponentNode, interfaceName: string): ITextInsertMutation => {
    const propsArgument = node.parameters[0];

    return {
        insertion: `: ${interfaceName}`,
        range: {
            begin: propsArgument.end,
        },
        type: "text-insert",
    };
};
