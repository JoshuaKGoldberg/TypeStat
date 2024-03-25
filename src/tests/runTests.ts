import { describeMutationTestCases } from "automutate-tests";
import { Command } from "commander";
import * as fs from "fs";
import * as path from "node:path";
import ts from "typescript";

import { fillOutRawOptions } from "../options/fillOutRawOptions.js";
import { RawTypeStatOptions } from "../options/types.js";
import { createTypeStatProvider } from "../runtime/createTypeStatProvider.js";
import { infiniteWaveThreshold } from "../runtime/providers/tracking/WaveTracker.js";
import { arrayify } from "../shared/arrays.js";

interface ParsedOptions {
	accept?: boolean;
	console?: boolean;
	include?: string;
}

const parsed: ParsedOptions = new Command()
	// Allow unknown options for the case of IDE debuggers who directly write to process.argv
	// If this line is removed, VS Code debugging will break 😲
	.allowUnknownOption(true)
	.option(
		"-a, --accept",
		"override existing expected results instead of asserting",
	)
	.option("--console [console]", "whether to forward logs to the console")
	.option("-i, --include [include]", "path to a TypeScript project file")
	.parse(process.argv)
	.opts();

const rawPathToRegExp = (rawPath: string) =>
	new RegExp(
		`.*${rawPath.replace(/^test/, "").split(/\\|\//).filter(Boolean).slice(-3).join(".*")}.*`,
		"i",
	);

// The .vscode/launch.json task adds includes via environment variable
const includes = [
	...arrayify(parsed.include ?? []).map(rawPathToRegExp),
	...arrayify(process.env.TEST_GLOB).map(rawPathToRegExp),
];

describeMutationTestCases(
	path.join(import.meta.dirname, "../../test"),
	(fileName, typeStatPath) => {
		if (typeStatPath === undefined) {
			throw new Error(`Could not find typestat.json for ${fileName}.`);
		}

		const projectDirectory = path.dirname(typeStatPath);
		const rawOptions = JSON.parse(
			fs.readFileSync(typeStatPath).toString(),
		) as RawTypeStatOptions;

		const projectPath = path.join(projectDirectory, "tsconfig.json");
		const rawCompilerOptions = fs.readFileSync(typeStatPath).toString();
		const compilerOptions = (
			ts.parseConfigFileTextToJson(typeStatPath, rawCompilerOptions) as {
				config: ts.CompilerOptions;
			}
		).config;
		const output = {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			log: parsed.console ? console.log.bind(console, "[log]") : () => {},
			stderr: console.error.bind(console),
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			stdout: parsed.console ? console.log.bind(console, "[stdout]") : () => {},
		};

		return createTypeStatProvider({
			...fillOutRawOptions({
				argv: { args: [] },
				compilerOptions,
				cwd: path.dirname(projectPath),
				output,
				projectPath,
				rawOptions: {
					...rawOptions,
					projectPath,
				},
			}),
			fileNames: [fileName],
		});
	},
	{
		accept: parsed.accept ?? !!process.env.TEST_ACCEPT,
		actual: (original) => (original.endsWith("x") ? "actual.tsx" : "actual.ts"),
		expected: (original) =>
			original.endsWith("x") ? "expected.tsx" : "expected.ts",
		includes,
		normalizeEndlines: "\n",
		original: "./original.*",
		settings: "typestat.json",
		waves: { maximum: infiniteWaveThreshold + 1 },
	},
);
