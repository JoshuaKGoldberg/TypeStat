import { IMutation, IMutationsWave } from "automutate";
import chalk from "chalk";

import { TypeStatOptions } from "../../options/types";
import { LazyCache } from "../../services/LazyCache";
import { FileInfoCache } from "../../shared/FileInfoCache";
import { convertMapToObject, Dictionary } from "../../shared/maps";
import { NameGenerator } from "../../shared/NameGenerator";
import { collectFilteredNodes } from "../collectFilteredNodes";
import { createFileNamesAndServices } from "../createFileNamesAndServices";
import { findMutationsInFile } from "../findMutationsInFile";

/**
 * Creates a mutations provider that runs the core mutations within TypeStat.
 *
 * @param options   Parsed runtime options for TypeStat.
 * @param allModifiedFileNames   Set to mark names of all files that were modified.
 */
export const createCoreMutationsProvider = (options: TypeStatOptions, allModifiedFiles: Set<string>) => {
    const fileNamesAndServicesCache = createFileNamesAndServicesCache(options);
    let lastFileIndex = -1;

    return async (): Promise<IMutationsWave> => {
        const startTime = Date.now(),
            fileMutations = new Map<string, readonly IMutation[]>(),
            { fileNames, services } = fileNamesAndServicesCache.get(),
            waveStartedFromBeginning = lastFileIndex <= 0;
        let addedMutations = 0;

        for (lastFileIndex = lastFileIndex + 1; lastFileIndex < fileNames.length; lastFileIndex += 1) {
            const fileName = fileNames[lastFileIndex],
                sourceFile = services.program.getSourceFile(fileName);
            if (sourceFile === undefined) {
                options.logger.stderr.write(`Could not find TypeScript source file for '${fileName}'.\n`);
                continue;
            }

            const filteredNodes = collectFilteredNodes(options, sourceFile),
                foundMutations = await findMutationsInFile({
                    fileInfoCache: new FileInfoCache(filteredNodes, services, sourceFile),
                    filteredNodes,
                    nameGenerator: new NameGenerator(sourceFile.fileName),
                    options,
                    services,
                    sourceFile,
                });

            if (foundMutations !== undefined && foundMutations.length !== 0) {
                addedMutations += foundMutations.length;
                fileMutations.set(fileName, foundMutations);
            }

            if (addedMutations > 100 || (addedMutations !== 0 && Date.now() - startTime > 10000)) {
                break;
            }
        }

        if (lastFileIndex === fileNames.length) {
            lastFileIndex = 0;

            // Only recreate the language service once we've visited every file
            // This way we don't constantly re-scan many of the source files each wave
            // Eventually it would be nice to support incremental updates
            // See https://github.com/JoshuaKGoldberg/TypeStat/issues/36
            fileNamesAndServicesCache.clear();
        }

        for (const fileName of fileMutations.keys()) {
            allModifiedFiles.add(fileName);
        }

        return {
            fileMutations:
                waveStartedFromBeginning && fileMutations.size === 0
                    ? undefined
                    : (convertMapToObject(fileMutations) as Dictionary<IMutation[]>),
        };
    };
};

const createFileNamesAndServicesCache = (options: TypeStatOptions) => {
    return new LazyCache(() => {
        options.logger.stdout.write(chalk.grey("Preparing language services to visit files...\n"));

        const { fileNames, services } = createFileNamesAndServices(options);
        options.logger.stdout.write(chalk.grey(`Prepared language services for ${fileNames.length} files...\n`));

        return { fileNames, services };
    });
};
