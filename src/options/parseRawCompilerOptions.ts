import * as fsp from "node:fs/promises";
import ts from "typescript";

import { stringifyDiagnosticMessageText } from "../shared/diagnostics.js";

export interface ParsedTsConfig {
	compilerOptions: ts.CompilerOptions | undefined;
	include?: string[];
}

export const parseRawCompilerOptions = async (
	cwd: string,
	projectPath: string,
): Promise<ParsedTsConfig> => {
	const configRaw = (await fsp.readFile(projectPath)).toString();
	const configResult = ts.parseConfigFileTextToJson(projectPath, configRaw);
	if (configResult.error !== undefined) {
		throw new Error(
			`Could not parse compiler options from '${projectPath}': ${stringifyDiagnosticMessageText(configResult.error)}`,
		);
	}

	const config = configResult.config as ParsedTsConfig;

	// TSConfig includes often come in a glob form like ["src"]
	config.include &&= ts.parseJsonConfigFileContent(
		config,
		{
			// eslint-disable-next-line @typescript-eslint/unbound-method
			directoryExists: ts.sys.directoryExists,
			// eslint-disable-next-line @typescript-eslint/unbound-method
			fileExists: ts.sys.fileExists,
			getCurrentDirectory: () => process.cwd(),
			// eslint-disable-next-line @typescript-eslint/unbound-method
			getDirectories: ts.sys.getDirectories,
			// eslint-disable-next-line @typescript-eslint/unbound-method
			readDirectory: ts.sys.readDirectory,
			// eslint-disable-next-line @typescript-eslint/unbound-method
			readFile: ts.sys.readFile,
			useCaseSensitiveFileNames: true,
		},
		cwd,
	).fileNames;

	return config;
};
