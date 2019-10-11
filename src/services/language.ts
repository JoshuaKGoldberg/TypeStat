import * as fs from "mz/fs";
import * as ts from "typescript";

import { ExposedProgram } from "../mutations/createExposedTypeScript";
import { TypeStatOptions } from "../options/types";

import { createProgramConfiguration } from "./createProgramConfiguration";

/**
 * Language service and type information with their backing TypeScript configuration.
 */
export interface LanguageServices {
    readonly parsedConfiguration: ts.ParsedCommandLine;
    readonly languageService: ts.LanguageService;
    readonly program: ExposedProgram;
    readonly printNode: (node: ts.Node) => string;
}

/**
 * @returns Associated language service and type information based on TypeStat options.
 */
export const createLanguageServices = (options: TypeStatOptions): LanguageServices => {
    // Collect file names and parse raw options into a TypeScript program with its configuration settings
    const { fileNames, parsedConfiguration, program } = createProgramConfiguration(options),
        // Create a TypeScript language service using the compiler host
        servicesHost: ts.LanguageServiceHost = {
            fileExists: ts.sys.fileExists,
            getCompilationSettings: () => options.compilerOptions,
            getCurrentDirectory: () => options.package.directory,
            getDefaultLibFileName: ts.getDefaultLibFilePath,
            getScriptFileNames: () => fileNames,
            getScriptSnapshot: (fileName) =>
                fs.existsSync(fileName) ? ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString()) : undefined,
            getScriptVersion: () => "0",
            readDirectory: ts.sys.readDirectory,
            readFile: ts.sys.readFile,
        },
        languageService = ts.createLanguageService(servicesHost, ts.createDocumentRegistry()),
        // This printer will later come in handy for emitting raw ASTs to text
        printer = ts.createPrinter({
            newLine: options.compilerOptions.newLine,
        }),
        treePrinter = (node: ts.Node) =>
            printer.printNode(
                ts.EmitHint.Unspecified,
                node,
                ts.createSourceFile("temp.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX),
            );

    return { languageService, parsedConfiguration, program, printNode: treePrinter };
};
