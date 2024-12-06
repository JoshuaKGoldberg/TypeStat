import * as fsp from "node:fs/promises";
import ts from "typescript";

import { createParseConfigHost } from "../services/createParseConfigHost.js";
import { stringifyDiagnosticMessageText } from "../shared/diagnostics.js";

export interface ParsedTsConfig {
	compilerOptions: ts.CompilerOptions;
	include?: string[];
}

export const parseRawTsConfig = async (
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

	const parserConfig = ts.parseJsonConfigFileContent(
		configResult.config,
		createParseConfigHost(),
		cwd,
	);

	// TSConfig includes often come in a glob form like ["src"]
	config.include &&= parserConfig.fileNames;
	config.compilerOptions = parserConfig.options;

	return config;
};
