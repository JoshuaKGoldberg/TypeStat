import { Mutation, runMutations } from "automutate";
import * as fs from "node:fs/promises";
import path from "node:path";
import * as ts from "typescript";
import { convertMapToObject } from "typestat-utils";

import { TSInitializeOptions } from "../../types.js";
import { findRequireImportRewriteMutationsInFile } from "./findRequireImportRewriteMutationsInFile.js";

/**
 * Rewrites local require() calls in files to ESM imports.
 */
export const rewriteRequiresAsImports = async (
	options: TSInitializeOptions,
) => {
	let provided = false;

	// TODO: Add an even simpler built-in?
	await runMutations({
		mutationsProvider: {
			provide: async () => {
				if (provided) {
					return {};
				}

				provided = true;

				const fileMutations = new Map<string, Mutation[]>();

				for (const fileName of options.filePaths) {
					const sourceFile = ts.createSourceFile(
						fileName,
						(await fs.readFile(path.join(options.cwd, fileName))).toString(),
						ts.ScriptTarget.ESNext,
					);
					const foundMutations =
						findRequireImportRewriteMutationsInFile(sourceFile);

					if (foundMutations.length !== 0) {
						fileMutations.set(fileName, foundMutations);
					}
				}

				return {
					fileMutations: convertMapToObject(fileMutations),
				};
			},
		},
	});
};
