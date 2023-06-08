import { Mutation } from "automutate";

import { convertMapToObject, Dictionary } from "../../shared/maps";
import { createFileNamesAndServices } from "../createFileNamesAndServices";
import { createSingleUseProvider } from "../createSingleUseProvider";
import { suppressRemainingTypeIssues } from "../../cleanups/builtin/suppressTypeErrors";

/**
 * Creates a mutations provider that applies post-fix cleanups.
 *
 * @param allModifiedFileNames   Set to mark names of all files that were modified.
 * @returns Provider to apply post-fix cleanups, if needed.
 */
export const createCleanupsProvider = (allModifiedFiles: Set<string>) => {
    return createSingleUseProvider("Applying post-fix cleanups", (options) => {
        if (!Object.values(options.cleanups).filter(Boolean).length) {
            return undefined;
        }

        return () => {
            const fileMutations = new Map<string, ReadonlyArray<Mutation>>();
            const { fileNames, services } = createFileNamesAndServices(options);

            for (const fileName of fileNames) {
                const sourceFile = services.program.getSourceFile(fileName);
                if (sourceFile === undefined) {
                    options.output.stderr(`Could not find TypeScript source file for '${fileName}'.`);
                    continue;
                }

                const foundMutations = suppressRemainingTypeIssues({
                    options,
                    services,
                    sourceFile,
                });

                if (foundMutations?.length) {
                    allModifiedFiles.add(fileName);
                    fileMutations.set(fileName, foundMutations);
                }
            }

            return {
                mutationsWave: {
                    fileMutations: fileMutations.size === 0 ? undefined : (convertMapToObject(fileMutations) as Dictionary<Mutation[]>),
                },
            };
        };
    });
};
