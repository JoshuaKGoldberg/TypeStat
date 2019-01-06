import { IMutationsWave } from "automutate";
import * as fs from "mz/fs";

import { TypeStatOptions } from "../../options/types";
import { createProgramConfiguration } from "../../services/createProgramConfiguration";

/**
 * Creates a mutations wave to mark all previously mutated files as modified.
 *
 * @param options   Parsed runtime options for TypeStat.
 * @param allModifiedFileNames   Unique names of all files that were modified.
 * @returns Mutations wave marking all mutated files as modified.
 * @remarks
 * If files ever need to be updated for renamed paths, this could do it in fileMutations.
 */
export const createFileRenameProvider = (options: TypeStatOptions, allModifiedFileNames: Set<string>) => {
    // If we don't bother renaming .js(x) to .ts(x), this provider is a no-op
    if (!options.files.renameExtensions) {
        return async () => ({
            fileMutations: undefined,
        });
    }

    return async (): Promise<IMutationsWave> => {
        const fileNames = options.fileNames === undefined ? createProgramConfiguration(options).fileNames : options.fileNames;

        // For each file, if it's matched by .js(x), convert it to .ts(x)
        for (const fileName of fileNames) {
            if (fileName.match(/.js(x)/i) !== null) {
                await convertFileName(fileName, allModifiedFileNames);
            }
        }

        return {
            fileMutations: undefined,
        };
    };
};

const convertFileName = async (fileName: string, allModifiedFileNames: Set<string>) => {
    const newFileName = fileName.replace(/.js$/i, ".ts").replace(/.jsx$/i, ".tsx");

    await fs.rename(fileName, newFileName);

    allModifiedFileNames.delete(fileName);
    allModifiedFileNames.add(newFileName);
};

// if new path isn't already matched in tsconfig.json includes, add it exclusively
// if the old .js(x) path is still included, add it to excludes
