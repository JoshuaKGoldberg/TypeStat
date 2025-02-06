/* eslint-disable @typescript-eslint/unbound-method */
import ts from "typescript";

import { TypeStatOptions } from "../options/types.js";
import { arrayify, uniquify } from "../shared/arrays.js";

/**
 * Language service and type information with their backing TypeScript configuration.
 */
export interface LanguageServices {
	readonly languageService: ts.LanguageService;
	readonly printers: Printers;
	readonly program: ts.Program;
}

export interface Printers {
	readonly node: (node: ts.Node, sourceFile: ts.SourceFile) => string;
	readonly type: (
		types: readonly (string | ts.Type)[] | string | ts.Type,
		enclosingDeclaration?: ts.Node,
		typeFormatFlags?: ts.TypeFormatFlags,
	) => string;
}

/**
 * @returns Associated language service and type information based on TypeStat options.
 */
export const createLanguageServices = (
	options: TypeStatOptions,
): LanguageServices => {
	// Create a TypeScript language service
	const languageServiceHost: ts.LanguageServiceHost = {
		directoryExists: ts.sys.directoryExists,
		fileExists: ts.sys.fileExists,
		getCompilationSettings: () => options.parsedTsConfig.options,
		getCurrentDirectory: () => options.package.directory,
		getDefaultLibFileName: ts.getDefaultLibFilePath,
		getDirectories: ts.sys.getDirectories,
		getProjectReferences: () => options.parsedTsConfig.projectReferences,
		getScriptFileNames: () => options.parsedTsConfig.fileNames,
		getScriptSnapshot: (fileName) =>
			ts.sys.fileExists(fileName)
				? ts.ScriptSnapshot.fromString(ts.sys.readFile(fileName) ?? "")
				: undefined,
		getScriptVersion: () => "0",
		readDirectory: ts.sys.readDirectory,
		readFile: ts.sys.readFile,
	};
	const languageService = ts.createLanguageService(languageServiceHost);

	const program = languageService.getProgram();
	if (!program) {
		throw new Error("Error creating Program");
	}

	// This printer will later come in handy for emitting raw ASTs to text
	const printer = ts.createPrinter({
		newLine: options.parsedTsConfig.options.newLine,
	});
	const printers: Printers = {
		node(node, sourceFile) {
			return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
		},
		type(types, enclosingDeclaration, typeFormatFlags) {
			const typeChecker = program.getTypeChecker();
			return uniquify(
				...arrayify(types).map((type) =>
					typeof type === "string"
						? type
						: typeChecker.typeToString(
								// Our mutations generally always go for base primitives, not literals
								// This might need to be revisited for potential future high fidelity types...
								typeChecker.getBaseTypeOfLiteralType(type),
								enclosingDeclaration,
								typeFormatFlags,
							),
				),
			).join(" | ");
		},
	};

	return {
		languageService,
		printers,
		program,
	};
};
/* eslint-enable @typescript-eslint/unbound-method */
