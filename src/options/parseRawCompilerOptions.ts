import path from "node:path";
import ts from "typescript";

import { createParseConfigHost } from "../services/createParseConfigHost.js";
import { stringifyDiagnosticMessageText } from "../shared/diagnostics.js";

export const parseRawCompilerOptions = (
	cwd: string,
	projectPath: string,
): ts.ParsedCommandLine => {
	const configFile = ts.getParsedCommandLineOfConfigFile(
		path.resolve(cwd, projectPath),
		undefined,
		createParseConfigHost(cwd),
	);

	if (!configFile) {
		throw new Error("tsConfig file not found.");
	}

	if (configFile.errors.length) {
		throw new Error(
			`Could not parse compiler options from '${projectPath}': ${stringifyDiagnosticMessageText(configFile.errors[0])}`,
		);
	}

	return configFile;
};
