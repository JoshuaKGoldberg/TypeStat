import { describeMutationTestCases } from "automutate-tests";
import { Command } from "commander";
import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { createTSEnhanceProvider } from "../enhance/runtime/createTSEnhanceProvider.js";
import { infiniteWaveThreshold } from "../enhance/runtime/providers/tracking/WaveTracker.js";
import { fillOutRawOptions } from "../options/fillOutRawOptions.js";
import { RawTSEnhanceOptions } from "../options/types.js";
import { requireExposedTypeScript } from "../services/createExposedTypeScript.js";
import { arrayify } from "../shared/arrays.js";

const parsed = new Command()
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

// Modify TypeScript here so that no tests incur the performance penalty of doing it themselves
const ts = requireExposedTypeScript();

const rawPathToRegExp = (rawPath: string) =>
	new RegExp(`.*${rawPath.split(/\\|\//).slice(-3).join(".*")}.*`, "i");

// The .vscode/launch.json task adds includes via environment variable
const includes = [
	...arrayify(parsed.include ?? []).map(rawPathToRegExp),
	...arrayify(process.env.TEST_GLOB).map(rawPathToRegExp),
];

(globalThis as any).describe = describe;
(globalThis as any).expect = expect;
(globalThis as any).it = it;

describeMutationTestCases(
	path.join(__dirname, "../../test"),
	async (fileName, typeStatPath) => {
		if (typeStatPath === undefined) {
			throw new Error(`Could not find ts-enhance.json for ${fileName}.`);
		}

		const projectDirectory = path.dirname(typeStatPath);
		const rawOptions = JSON.parse(
			fs.readFileSync(typeStatPath).toString(),
		) as RawTSEnhanceOptions;

		const projectPath = path.join(projectDirectory, "tsconfig.json");
		const rawCompilerOptions = fs.readFileSync(typeStatPath).toString();
		const compilerOptions = ts.parseConfigFileTextToJson(
			typeStatPath,
			rawCompilerOptions,
		).config;
		const output = {
			log: parsed.console ? console.log.bind(console, "[log]") : vi.fn(),
			stderr: console.error.bind(console),
			stdout: parsed.console ? console.log.bind(console, "[stdout]") : vi.fn(),
		};

		return createTSEnhanceProvider({
			...(await fillOutRawOptions({
				compilerOptions,
				cwd: path.dirname(projectPath),
				output,
				projectPath,
				rawOptions: {
					...rawOptions,
					projectPath,
				},
			})),
			fileNames: [fileName],
		});
	},
	{
		accept: parsed.accept || !!process.env.TEST_ACCEPT,
		actual: (original) => (original.endsWith("x") ? "actual.tsx" : "actual.ts"),
		expected: (original) =>
			original.endsWith("x") ? "expected.tsx" : "expected.ts",
		includes,
		normalizeEndlines: "\n",
		original: "./original.*",
		settings: "ts-enhance.json",
		waves: { maximum: infiniteWaveThreshold + 1 },
	},
);
