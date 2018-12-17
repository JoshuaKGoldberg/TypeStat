import { tsquery } from "@phenomnomnominal/tsquery";
import { IMutation, IMutationsProvider, IMutationsWave } from "automutate";
import * as ts from "typescript";

import { readline } from "mz";
import { TypeStatOptions } from "../options/types";
import { createFileNamesAndServices } from "../services/lazyFileNamesAndServices";
import { FileInfoCache } from "../shared/FileInfoCache";
import { convertMapToObject, Dictionary } from "../shared/maps";
import { findMutationsInFile } from "./findMutationsInFile";

/**
 * Mutations to be applied to files, keyed by file name.
 */
export const createTypeStatMutationsProvider = (options: TypeStatOptions): IMutationsProvider => {
    let lastFileIndex = -1;
    let hasPassedFirstFile = false;

    return {
        provide: async (): Promise<IMutationsWave> => {
            const startTime = Date.now();
            const fileMutations = new Map<string, ReadonlyArray<IMutation>>();
            const { fileNames, services } = await createFileNamesAndServices(options);
            const waveStartedFromBeginning = lastFileIndex <= 0;
            let addedMutations = 0;

            for (lastFileIndex = lastFileIndex + 1; lastFileIndex < fileNames.length; lastFileIndex += 1) {
                const fileName = fileNames[lastFileIndex];

                const sourceFile = services.program.getSourceFile(fileName);
                if (sourceFile === undefined) {
                    options.logger.stderr.write(`Could not find TypeScript source file for '${fileName}'.\n`);
                    continue;
                }

                const foundMutations = await findMutationsInFile({
                    fileInfoCache: new FileInfoCache(sourceFile),
                    filteredNodes: collectFilteredNodes(options, sourceFile),
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

            return {
                fileMutations: waveStartedFromBeginning && fileMutations.size === 0
                    ? undefined
                    : convertMapToObject(fileMutations) as Dictionary<IMutation[]>,
            };
        },
    };
};

const collectFilteredNodes = (options: TypeStatOptions, sourceFile: ts.SourceFile) => {
    const filteredNodes = new Set<ts.Node>();

    if (options.filters === undefined) {
        return filteredNodes;
    }

    for (const filter of options.filters) {
        for (const node of tsquery(sourceFile, filter)) {
            filteredNodes.add(node);
        }
    }

    return filteredNodes;
};
