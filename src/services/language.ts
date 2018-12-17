import * as fs from "mz/fs";
import * as path from "path";
import * as ts from "typescript";

import { TypeStatOptions } from "../options/types";
import { collectOptionals } from "../shared/arrays";

/**
 * Language service and type information with their backing TypeScript configuration.
 */
export interface LanguageServices {
    readonly parsedConfiguration: ts.ParsedCommandLine;
    readonly languageService: ts.LanguageService;
    readonly program: ts.Program;
}

/**
 * @param projectPath   Path to a tsconfig.json project file.
 * @returns Associated language service and type information based on the config file.
 */
export const createLanguageServices = async (options: TypeStatOptions): Promise<LanguageServices> => {
    // Read the raw configuration data from disk and attempt to parse it as JSON
    const configRaw = (await fs.readFile(options.projectPath)).toString();
    const compilerOptions = ts.parseConfigFileTextToJson(options.projectPath, configRaw);
    if (compilerOptions.error !== undefined) {
        throw new Error(`Could not parse compiler options from '${options.projectPath}': ${compilerOptions.error}`);
    }

    // Parse the JSON into raw TypeScript options, overriding compiler options to always be our options' equivalent
    const compilerConfigOptionsRaw = compilerOptions.config as ts.CompilerOptions;
    const compilerConfigOptions: ts.CompilerOptions = {
        ...compilerConfigOptionsRaw,
        noImplicitAny: compilerConfigOptionsRaw.noImplicitAny || options.fixes.noImplicitAny,
        strictNullChecks: compilerConfigOptionsRaw.strict || compilerConfigOptionsRaw.strictNullChecks || options.fixes.strictNullChecks,
    };

    // Create a TypeScript configuration using the raw options
    const parsedConfiguration = ts.parseJsonConfigFileContent(
        compilerConfigOptions,
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
    const fileNames = collectOptionals(options.fileNames, parsedConfiguration.fileNames);

    // Create a basic TypeScript compiler host and program using the parsed compiler options
    const host = ts.createCompilerHost({}, true);
    const program = ts.createProgram(fileNames, compilerConfigOptions, host);

    // Create a TypeScript language service using the compiler host
    const servicesHost: ts.LanguageServiceHost = {
        fileExists: ts.sys.fileExists,
        getCompilationSettings: () => compilerConfigOptions,
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
