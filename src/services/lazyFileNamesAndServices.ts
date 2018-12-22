import * as path from "path";

import chalk from "chalk";
import { readline } from "mz";
import { TypeStatOptions } from "../options/types";
import { normalizeAndSlashify } from "../shared/paths";
import { createLanguageServices, LanguageServices } from "./language";

export interface FileNamesAndServices {
    readonly fileNames: ReadonlyArray<string>;
    readonly services: LanguageServices;
}

export const createFileNamesAndServices = async (options: TypeStatOptions): Promise<FileNamesAndServices> => {
    options.logger.stdout.write(chalk.grey("Preparing language services to visit files...\n"));
    const services = await createLanguageServices(options);
    const fileNames =
        options.fileNames === undefined
            ? Array.from(createFileNamesUsingProgram(services.parsedConfiguration.fileNames, options)).filter(
                  (fileName) => !fileName.endsWith(".d.ts"),
              )
            : options.fileNames;

    readline.moveCursor(options.logger.stdout, 0, -1);
    readline.clearLine(options.logger.stdout, 0);
    return { fileNames, services };
};

const createFileNamesUsingProgram = (programFileNames: ReadonlyArray<string>, options: TypeStatOptions): ReadonlySet<string> => {
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
