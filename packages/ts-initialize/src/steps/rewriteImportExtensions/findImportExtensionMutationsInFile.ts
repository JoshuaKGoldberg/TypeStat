import { Mutation } from "automutate";
import * as ts from "typescript";

import { createImportExtensionMutation } from "./createImportExtensionMutation.js";
import { isExtensionlessExportOrImport } from "./isExtensionlessExportOrImport.js";

export const findImportExtensionMutationsInFile = (
	dirPath: string,
	sourceFile: ts.SourceFile,
) => {
	const mutations: Mutation[] = [];

	const visitNode = (node: ts.Node) => {
		if (isExtensionlessExportOrImport(node)) {
			const mutation = createImportExtensionMutation(dirPath, node);

			if (mutation !== undefined) {
				mutations.push(mutation);
			}
		}

		ts.forEachChild(node, visitNode);
	};

	visitNode(sourceFile);

	return mutations;
};
