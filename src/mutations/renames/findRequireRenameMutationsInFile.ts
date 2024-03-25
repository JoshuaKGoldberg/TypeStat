import { Mutation } from "automutate";
import ts from "typescript";

import { TypeStatOptions } from "../../options/types.js";
import { createRequireMutation } from "./createRequireMutation.js";
import { isRequireToJsFile } from "./isRequireToJsFile.js";

export interface RequireRenameRequest {
	allFileNames: ReadonlySet<string>;
	options: TypeStatOptions;
	sourceFile: ts.SourceFile;
}

export const findRequireRenameMutationsInFile = (
	request: RequireRenameRequest,
) => {
	const mutations: Mutation[] = [];
	const visitNode = (node: ts.Node) => {
		if (isRequireToJsFile(node)) {
			const mutation = createRequireMutation(request, node);

			if (mutation !== undefined) {
				mutations.push(mutation);
			}
		}

		ts.forEachChild(node, visitNode);
	};

	visitNode(request.sourceFile);

	return mutations;
};
