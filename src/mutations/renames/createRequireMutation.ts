import { ITextSwapMutation } from "automutate";

import { RequireRenameRequest } from "./findRequireRenameMutationsInFile";
import { LocalImplicitRequireCallExpression } from "./isRequireToJsFile";

export const createRequireMutation = (
    request: RequireRenameRequest,
    node: LocalImplicitRequireCallExpression,
): ITextSwapMutation | undefined => {
    const newLocalFilePath = node.arguments[0].text.replace(/.js$/i, ".ts").replace(/.jsx$/i, ".tsx"),
        newLocalImportPath = newLocalFilePath.replace(/.tsx?$/i, "");

    return {
        insertion: `(${node.getText(request.sourceFile)} as typeof import("${newLocalImportPath}"))`,
        range: {
            begin: node.getStart(request.sourceFile),
            end: node.end,
        },
        type: "text-swap",
    };
};
