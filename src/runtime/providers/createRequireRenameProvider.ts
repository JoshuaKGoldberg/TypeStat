import { Mutation } from "automutate";

import { findRequireRenameMutationsInFile } from "../../mutations/renames/findRequireRenameMutationsInFile.js";
import { Dictionary, convertMapToObject } from "../../shared/maps.js";
import { createFileNamesAndServices } from "../createFileNamesAndServices.js";
import { createSingleUseProvider } from "../createSingleUseProvider.js";

/**
 * Creates a mutations provider that transforms local require() calls in files.
 * @param allModifiedFiles   Set to mark names of all files that were modified.
 * @returns Provider to transform local require() calls in files, if needed.
 */
export const createRequireRenameProvider = (allModifiedFiles: Set<string>) => {
	return createSingleUseProvider(
		"Transforming local require() calls in files",
		(options) => {
			if (!options.files.renameExtensions) {
				return undefined;
			}

			return () => {
				const fileMutations = new Map<string, readonly Mutation[]>();
				const { fileNames, services } = createFileNamesAndServices(options);
				const allFileNames = new Set(fileNames);

				for (const fileName of fileNames) {
					const sourceFile = services.program.getSourceFile(fileName);
					if (sourceFile === undefined) {
						options.output.stderr(
							`Could not find TypeScript source file for '${fileName}'.`,
						);
						continue;
					}

					const foundMutations = findRequireRenameMutationsInFile({
						allFileNames,
						options,
						sourceFile,
					});

					if (foundMutations.length !== 0) {
						allModifiedFiles.add(fileName);
						fileMutations.set(fileName, foundMutations);
					}
				}

				return {
					mutationsWave: {
						fileMutations:
							fileMutations.size === 0
								? undefined
								: (convertMapToObject(fileMutations) as Dictionary<Mutation[]>),
					},
				};
			};
		},
	);
};
