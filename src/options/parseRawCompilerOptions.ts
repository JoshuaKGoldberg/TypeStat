import { glob } from "glob";
import { minimatch } from "minimatch";
import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as path from "node:path";
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
			fileExists: (filePath) => fs.statSync(filePath).isFile(),
			readDirectory: (rootDir, extensions, excludes, includes) =>
				includes
					.flatMap((include) => glob.sync(path.join(rootDir, include)))
					.filter(
						(filePath) =>
							!excludes?.some((exclude) => minimatch(filePath, exclude)) &&
							extensions.some((extension) => filePath.endsWith(extension)),
					)
					.map((filePath) => path.relative(rootDir, filePath)),
			readFile: (filePath) => fs.readFileSync(filePath).toString(),
			useCaseSensitiveFileNames: true,
		},
		cwd,
	).fileNames;

	return config;
};
