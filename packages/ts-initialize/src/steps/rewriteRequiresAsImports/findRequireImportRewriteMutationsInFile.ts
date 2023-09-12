import { Mutation } from "automutate";
import * as ts from "typescript";

import { createRequireImportMutation } from "./createRequireMutation.js";
import { isRequireToJsFile } from "./isRequireToJsFile.js";

export const findRequireImportRewriteMutationsInFile = (
	sourceFile: ts.SourceFile,
) => {
	const mutations: Mutation[] = [];

	const visitNode = (node: ts.Node) => {
		if (isRequireToJsFile(node)) {
			mutations.push(createRequireImportMutation(sourceFile, node));
		}

		ts.forEachChild(node, visitNode);
	};

	visitNode(sourceFile);

	return mutations;
};
