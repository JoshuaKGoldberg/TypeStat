import { TextSwapMutation } from "automutate";

import { RequireRenameRequest } from "./findRequireRenameMutationsInFile.js";
import { LocalImplicitRequireCallExpression } from "./isRequireToJsFile.js";

export const createRequireMutation = (
	request: RequireRenameRequest,
	node: LocalImplicitRequireCallExpression,
): TextSwapMutation | undefined => {
	const newLocalFilePath = node.arguments[0].text
		.replace(/.js$/i, ".ts")
		.replace(/.jsx$/i, ".tsx");
	const newLocalImportPath = newLocalFilePath.replace(/.tsx?$/i, "");

	return {
		insertion: `(${node.getText(request.sourceFile)} as typeof import("${newLocalImportPath}"))`,
		range: {
			begin: node.getStart(request.sourceFile),
			end: node.end,
		},
		type: "text-swap",
	};
};
