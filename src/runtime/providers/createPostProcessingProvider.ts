import { IMutationsWave } from "automutate";

import { TypeStatOptions } from "../../options/types";
import { createSingleUseProvider } from "../createSingleUserProvider";

import { runCommand } from "./missingTypes/runCommand";

/**
 * Creates a mutations wave to run any post-processing shell scripts.
 *
 * @param options   Parsed runtime options for TypeStat.
 * @param allModifiedFilePaths   Unique names of all files that were modified.
 * @returns Mutations wave with no direct mutation changes.
 */
export const createPostProcessingProvider = (options: TypeStatOptions, allModifiedFilePaths: ReadonlySet<string>) => {
    return createSingleUseProvider(async (): Promise<IMutationsWave> => {
        for (const shellCommand of options.postProcess.shell) {
            await runCommand(options, [...shellCommand, ...Array.from(allModifiedFilePaths)]);
        }

        return {};
    });
};
