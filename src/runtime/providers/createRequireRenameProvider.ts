import { IMutation, IMutationsWave } from "automutate";

import { findRequireRenameMutationsInFile } from "../../mutations/renames/findRequireRenameMutationsInFile";
import { TypeStatOptions } from "../../options/types";
import { convertMapToObject, Dictionary } from "../../shared/maps";
import { createFileNamesAndServices } from "../createFileNamesAndServices";
import { createSingleUseProvider } from "../createSingleUserProvider";

/**
 * Creates a mutations provider that transforms local require() calls in files.
 *
 * @param options   Parsed runtime options for TypeStat.
 * @param allModifiedFileNames   Set to mark names of all files that were modified.
 */
export const createRequireRenameProvider = (options: TypeStatOptions, allModifiedFiles: Set<string>) => {
    return createSingleUseProvider(
        async (): Promise<IMutationsWave> => {
            if (!options.files.renameExtensions) {
                return {
                    fileMutations: undefined,
                };
            }

            const fileMutations = new Map<string, ReadonlyArray<IMutation>>();
            const { fileNames, services } = createFileNamesAndServices(options);
            const allFileNames = new Set(fileNames);

            for (const fileName of fileNames) {
                const sourceFile = services.program.getSourceFile(fileName);
                if (sourceFile === undefined) {
                    options.logger.stderr.write(`Could not find TypeScript source file for '${fileName}'.\n`);
                    continue;
                }

                const foundMutations = findRequireRenameMutationsInFile({
                    allFileNames,
                    options,
                    services,
                    sourceFile,
                });

                if (foundMutations.length !== 0) {
                    allModifiedFiles.add(fileName);
                    fileMutations.set(fileName, foundMutations);
                }
            }

            return {
                fileMutations: fileMutations.size === 0 ? undefined : (convertMapToObject(fileMutations) as Dictionary<IMutation[]>),
            };
        },
    );
};
