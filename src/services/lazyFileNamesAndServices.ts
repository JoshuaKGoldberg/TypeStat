import * as path from "path";

import { TypeStatOptions } from "../options/types";
import { LazyValue } from "../shared/lazy";
import { normalizeAndSlashify } from "../shared/paths";
import { createLanguageServices, LanguageServices } from "./language";

export interface FileNamesAndServices {
    readonly fileNames: ReadonlyArray<string>;
    readonly services: LanguageServices;
}

export const createLazyFileNamesAndServices = (options: TypeStatOptions): LazyValue<FileNamesAndServices> => {
    return new LazyValue(async (): Promise<FileNamesAndServices> => {
        const services = await createLanguageServices(options);
        const fileNames = Array.from(createFileNamesUsingProgram(services.parsedConfiguration.fileNames, options))
            .filter((fileName) => !fileName.endsWith(".d.ts"));

        return { fileNames, services };
    });
};

const createFileNamesUsingProgram = (
    programFileNames: ReadonlyArray<string>,
    options: TypeStatOptions
): ReadonlySet<string> => {
    const inputFileNames = options.fileNames;
    if (inputFileNames === undefined) {
        return new Set(programFileNames);
    }

    const backingFileNames = new Map<string, string>(
        programFileNames.map((fileName): [string, string] => [fileName, normalizeAndSlashify(fileName)]),
    );

    return new Set(
        inputFileNames.map((inputFileName) => {
            inputFileName = normalizeAndSlashify(inputFileName);
        
            // Attempt 1: already-absolute path, such as "C:/Code/repository/src/index.ts"
            let backingFileName = backingFileNames.get(inputFileName);

            // Attempt 2: relative path to the tsconfig.json, such as "src/index.ts"
            if (backingFileName === undefined) {
                backingFileName = backingFileNames.get(normalizeAndSlashify(path.join(path.dirname(options.projectPath), inputFileName)));
            }

            if (backingFileName === undefined) {
                throw new Error(`Could not find backing TypeScript file path for '${inputFileName}'.`);
            }

            return backingFileName;
        }),
    );
};
