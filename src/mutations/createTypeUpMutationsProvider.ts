import { IFileMutations, IMutationsProvider, IMutationsWave } from "automutate";
import * as path from "path";

import { createLanguageServices, LanguageServices } from "../language";
import { TypeUpOptions } from "../options";
import { createLazyValue } from "../shared/lazy";
import { findMutationsInFile } from "./findMutationsInFile";

interface FileNamesAndServices {
    readonly fileNames: ReadonlyArray<string>;
    readonly services: LanguageServices;
}

const normalizeAndSlashify = (filePath: string) => path.normalize(filePath).replace(/\\/g, "/");

const createFileNamesUsingProgram = (
    programFileNames: ReadonlyArray<string>,
    inputFileNames?: ReadonlyArray<string>,
): ReadonlySet<string> => {
    if (inputFileNames === undefined) {
        return new Set(programFileNames);
    }

    const backingFileNames = new Map<string, string>(
        programFileNames.map((fileName): [string, string] => [fileName, normalizeAndSlashify(fileName)]),
    );

    return new Set(
        inputFileNames.map((inputFileName) => {
            const backingFileName = backingFileNames.get(normalizeAndSlashify(inputFileName));

            if (backingFileName === undefined) {
                throw new Error(`Could not find backing TypeScript file path for '${inputFileName}'.`);
            }

            return backingFileName;
        }),
    );
};

export const createTypeUpMutationsProvider = (options: TypeUpOptions): IMutationsProvider => {
    const lazyFileNamesAndServices = createLazyValue(async (): Promise<FileNamesAndServices> => {
        const services = await createLanguageServices(options);
        const fileNames = Array.from(createFileNamesUsingProgram(services.parsedConfiguration.fileNames, options.fileNames))
            .filter((fileName) => !fileName.endsWith(".d.ts"));

        return { fileNames, services };
    });

    let lastFileIndex = -1;

    return {
        provide: async (): Promise<IMutationsWave> => {
            const { services, fileNames } = await lazyFileNamesAndServices.get();
            const startTime = Date.now();
            const fileMutations: IFileMutations = {};
            let addedMutations = 0;

            for (lastFileIndex = lastFileIndex + 1; lastFileIndex < fileNames.length; lastFileIndex += 1) {
                const fileName = fileNames[lastFileIndex];
                const sourceFile = services.program.getSourceFile(fileName);

                if (sourceFile === undefined) {
                    throw new Error(`Could not find TypeScript source file for '${fileName}'.`);
                }

                const foundMutations = await findMutationsInFile({
                    options,
                    services,
                    sourceFile,
                });

                if (foundMutations.length !== 0) {
                    addedMutations += foundMutations.length;
                    fileMutations[fileName] = foundMutations;
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
                fileMutations: Object.keys(fileMutations).length === 0 ? undefined : fileMutations,
            };
        },
    };
};
