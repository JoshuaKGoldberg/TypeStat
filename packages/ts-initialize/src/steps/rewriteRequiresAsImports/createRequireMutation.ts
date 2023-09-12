import { TextSwapMutation } from "automutate";
import * as ts from "typescript";

import { LocalImplicitRequireCallExpression } from "./isRequireToJsFile.js";

export const createRequireImportMutation = (
	sourceFile: ts.SourceFile,
	node: LocalImplicitRequireCallExpression,
): TextSwapMutation => {
	const newLocalFilePath = node.arguments[0].text
		.replace(/.js$/i, ".ts")
		.replace(/.jsx$/i, ".tsx");
	const newLocalImportPath = newLocalFilePath.replace(/.tsx?$/i, "");

	return {
		insertion: `(${node.getText(
			sourceFile,
		)} as typeof import("${newLocalImportPath}"))`,
		range: {
			begin: node.getStart(sourceFile),
			end: node.end,
		},
		type: "text-swap",
	};
};
