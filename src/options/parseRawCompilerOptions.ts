import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import ts from "typescript";

import { stringifyDiagnosticMessageText } from "../shared/diagnostics.js";

export interface ParsedCompilerOptions extends ts.CompilerOptions {
	include?: string[];
}

export const parseRawCompilerOptions = async (
	cwd: string,
	projectPath: string,
): Promise<ts.CompilerOptions> => {
	const configRaw = (await fsp.readFile(projectPath)).toString();
	const compilerOptions = ts.parseConfigFileTextToJson(projectPath, configRaw);
	if (compilerOptions.error !== undefined) {
		throw new Error(
			`Could not parse compiler options from '${projectPath}': ${stringifyDiagnosticMessageText(compilerOptions.error)}`,
		);
	}

	const config = compilerOptions.config as ParsedCompilerOptions;

	// TSConfig includes often come in a glob form like ["src"]
	config.include &&= ts.parseJsonConfigFileContent(
		compilerOptions.config,
		{
			fileExists: fs.existsSync,
			// eslint-disable-next-line @typescript-eslint/unbound-method
			readDirectory: ts.sys.readDirectory,
			readFile: (file) => fs.readFileSync(file, "utf8"),
			useCaseSensitiveFileNames: true,
		},
		cwd,
	).fileNames;

	return config;
};
