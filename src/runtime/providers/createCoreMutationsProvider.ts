import { IMutation, IMutationsWave } from "automutate";
import { readline } from "mz";

import chalk from "chalk";
import { TypeStatOptions } from "../../options/types";
import { createLanguageServices } from "../../services/language";
import { LazyCache } from "../../services/LazyCache";
import { FileInfoCache } from "../../shared/FileInfoCache";
import { convertMapToObject, Dictionary } from "../../shared/maps";
import { collectFilteredNodes } from "../collectFilteredNodes";
import { findMutationsInFile } from "../findMutationsInFile";

/**
 * Creates a mutations provider that runs the core mutations within TypeStat.
 *
 * @param options   Parsed runtime options for TypeStat.
 * @param allModifiedFileNames   Set to mark names of all files that were modified.
 */
export const createCoreMutationsProvider = (options: TypeStatOptions, allModifiedFiles: Set<string>) => {
    const fileNamesAndServicesCache = new LazyCache(() => createFileNamesAndServices(options));
    let lastFileIndex = -1;
    let hasPassedFirstFile = false;

    return async (): Promise<IMutationsWave> => {
        const startTime = Date.now();
        const fileMutations = new Map<string, ReadonlyArray<IMutation>>();
        const { fileNames, services } = fileNamesAndServicesCache.get();
        const waveStartedFromBeginning = lastFileIndex <= 0;
        let addedMutations = 0;

        for (lastFileIndex = lastFileIndex + 1; lastFileIndex < fileNames.length; lastFileIndex += 1) {
            const fileName = fileNames[lastFileIndex];

            const sourceFile = services.program.getSourceFile(fileName);
            if (sourceFile === undefined) {
                options.logger.stderr.write(`Could not find TypeScript source file for '${fileName}'.\n`);
                continue;
            }

            const filteredNodes = collectFilteredNodes(options, sourceFile);
            const foundMutations = await findMutationsInFile({
                fileInfoCache: new FileInfoCache(filteredNodes, services, sourceFile),
                filteredNodes,
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
        }

        if (!hasPassedFirstFile) {
            hasPassedFirstFile = true;
        } else {
            readline.clearLine(options.logger.stdout, 0);
            readline.moveCursor(options.logger.stdout, 0, -1);
        }

        // Only recreate the language service once we've visited every file
        // This way we don't constantly re-scan many of the source files each wave
        // Eventually it would be nice to support incremental updates
        // See https://github.com/JoshuaKGoldberg/TypeStat/issues/36
        if (lastFileIndex === 0) {
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

const createFileNamesAndServices = (options: TypeStatOptions) => {
    options.logger.stdout.write(chalk.grey("Preparing language services to visit files...\n"));
    const services = createLanguageServices(options);
    const fileNames =
        options.fileNames === undefined
            ? services.parsedConfiguration.fileNames.filter((fileName) => !fileName.endsWith(".d.ts"))
            : options.fileNames;

    readline.moveCursor(options.logger.stdout, 0, -1);
    readline.clearLine(options.logger.stdout, 0);
    return { fileNames, services };
};
