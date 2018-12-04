import { IMutation, IMutationsProvider, IMutationsWave } from "automutate";

import { TypeStatOptions } from "../options/types";
import { MutationPrinter } from "../printing/MutationsPrinter";
import { createLazyFileNamesAndServices } from "../services/lazyFileNamesAndServices";
import { convertMapToObject, Dictionary } from "../shared/maps";
import { FileInfoCache } from "./FileInfoCache";
import { findMutationsInFile } from "./findMutationsInFile";

/**
 * Mutations to be applied to files, keyed by file name.
 */
export const createTypeStatMutationsProvider = (options: TypeStatOptions): IMutationsProvider => {
    const lazyFileNamesAndServices = createLazyFileNamesAndServices(options);
    const printer = new MutationPrinter(options);
    let lastFileIndex = -1;

    return {
        provide: async (): Promise<IMutationsWave> => {
            const { fileNames, services } = await lazyFileNamesAndServices.get();
            const startTime = Date.now();
            const fileMutations = new Map<string, ReadonlyArray<IMutation>>();
            let addedMutations = 0;

            for (lastFileIndex = lastFileIndex + 1; lastFileIndex < fileNames.length; lastFileIndex += 1) {
                const fileName = fileNames[lastFileIndex];
                const sourceFile = services.program.getSourceFile(fileName);

                if (sourceFile === undefined) {
                    throw new Error(`Could not find TypeScript source file for '${fileName}'.`);
                }

                const foundMutations = await findMutationsInFile({
                    fileInfoCache: new FileInfoCache(sourceFile),
                    options,
                    printer,
                    services,
                    sourceFile,
                });

                if (foundMutations.length !== 0) {
                    addedMutations += foundMutations.length;
                    fileMutations.set(fileName, foundMutations);
                }

                if (addedMutations > 100 || (addedMutations !== 0 && Date.now() - startTime > 10000)) {
                    break;
                }
            }
            
            if (lastFileIndex === fileNames.length) {
                lastFileIndex = 0;
                lazyFileNamesAndServices.reset();
            }

            return {
                fileMutations: fileMutations.size === 0 ? undefined : convertMapToObject(fileMutations) as Dictionary<IMutation[]>,
            };
        },
    };
};
