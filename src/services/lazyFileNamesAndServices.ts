import * as path from "path";

import { TypeStatOptions } from "../options/types";
import { LazyValue } from "../shared/lazy";
import { createLanguageServices, LanguageServices } from "./language";

export interface FileNamesAndServices {
    readonly fileNames: ReadonlyArray<string>;
    readonly services: LanguageServices;
}

export const createLazyFileNamesAndServices = (options: TypeStatOptions): LazyValue<FileNamesAndServices> => {
    return new LazyValue(async (): Promise<FileNamesAndServices> => {
        const services = await createLanguageServices(options);
        const fileNames = Array.from(createFileNamesUsingProgram(services.parsedConfiguration.fileNames, options.fileNames))
            .filter((fileName) => !fileName.endsWith(".d.ts"));

        return { fileNames, services };
    });
};

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

const normalizeAndSlashify = (filePath: string) => path.normalize(filePath).replace(/\\/g, "/");
