import { IFileMutations, IMutationsProvider, IMutationsWave } from "automutate";
import * as path from "path";

import { createLanguageServices } from "../language";
import { TypeUpOptions } from "../options";
import { findMutationsInFile } from "./findMutationsInFile";

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
                console.log({ backingFileNames });
                throw new Error(`Could not find backing TypeScript file path for '${inputFileName}'.`);
            }

            return backingFileName;
        }),
    );
};

export const createTypeUpMutationsProvider = (options: TypeUpOptions): IMutationsProvider => ({
    provide: async (): Promise<IMutationsWave> => {
        const fileMutations: IFileMutations = {};
        const services = await createLanguageServices(options.projectPath);
        const fileNames = createFileNamesUsingProgram(services.parsedConfiguration.fileNames, options.fileNames);

        for (const fileName of fileNames) {
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
                fileMutations[fileName] = foundMutations;
            }
        }

        return {
            fileMutations: Object.keys(fileMutations).length === 0 ? undefined : fileMutations,
        };
    },
});
