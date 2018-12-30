import * as fs from "mz/fs";
import * as path from "path";
import * as ts from "typescript";

import { TypeStatOptions } from "../options/types";
import { collectOptionals } from "../shared/arrays";
import { normalizeAndSlashify } from "../shared/paths";

/**
 * Language service and type information with their backing TypeScript configuration.
 */
export interface LanguageServices {
    readonly parsedConfiguration: ts.ParsedCommandLine;
    readonly languageService: ts.LanguageService;
    readonly program: ts.Program;
}

/**
 * @returns Associated language service and type information based on TypeStat options.
 */
export const createLanguageServices = (options: TypeStatOptions): LanguageServices => {
    // Create a TypeScript configuration using the raw options
    const parsedConfiguration = ts.parseJsonConfigFileContent(
        options.compilerOptions,
        {
            fileExists: fs.existsSync,
            readDirectory: ts.sys.readDirectory,
            readFile: (file) => fs.readFileSync(file, "utf8"),
            useCaseSensitiveFileNames: true,
        },
        path.resolve(path.dirname(options.projectPath)),
        { noEmit: true },
    );

    // Include all possible file names in our program, including ones we won't later visit
    // TypeScript projects must include source files for all nodes we look at
    // See https://github.com/Microsoft/TypeScript/issues/28413
    const fileNames = Array.from(
        new Set(Array.from(collectOptionals(options.fileNames, parsedConfiguration.fileNames)).map(normalizeAndSlashify)),
    );

    // Create a basic TypeScript compiler host and program using the parsed compiler options
    const host = ts.createCompilerHost({}, true);
    const program = ts.createProgram(fileNames, options.compilerOptions, host);

    // Create a TypeScript language service using the compiler host
    const servicesHost: ts.LanguageServiceHost = {
        fileExists: ts.sys.fileExists,
        getCompilationSettings: () => options.compilerOptions,
        getCurrentDirectory: () => process.cwd(),
        getDefaultLibFileName: ts.getDefaultLibFilePath,
        getScriptFileNames: () => fileNames,
        getScriptSnapshot: (fileName) =>
            fs.existsSync(fileName) ? ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString()) : undefined,
        getScriptVersion: () => "0",
        readDirectory: ts.sys.readDirectory,
        readFile: ts.sys.readFile,
    };
    const languageService = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

    return { languageService, parsedConfiguration, program };
};
