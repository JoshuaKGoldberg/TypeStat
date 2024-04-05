import { runMutations } from "automutate";
import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

import { fillOutRawOptions } from "../options/fillOutRawOptions.js";
import { RawTypeStatOptions } from "../options/types.js";
import { createTypeStatProvider } from "../runtime/createTypeStatProvider.js";

export interface MutationTestResult {
	actualContent: string;
	expectedFilePath: string;
}

export const runMutationTest = async (dirPath: string) => {
	const originalFileName = (await fs.readdir(dirPath)).find((file) =>
		file.startsWith("original."),
	);
	if (!originalFileName) {
		throw new Error(`${dirPath} should have a file named original.*`);
	}

	const readFile = (filename: string) =>
		fs.readFile(path.join(dirPath, filename), {
			encoding: "utf-8",
		});

	const rawTypeStatOptions = await readFile("typestat.json");
	const rawOptions = JSON.parse(rawTypeStatOptions) as RawTypeStatOptions;

	const projectPath = path.join(dirPath, "tsconfig.json");
	const rawCompilerOptionsJson = await readFile("tsconfig.json");
	const convertResult = ts.parseConfigFileTextToJson(
		"tsconfig.json",
		rawCompilerOptionsJson,
	);

	if (convertResult.error) {
		console.error(convertResult.error);
		throw new Error("Error while reading tsconfig");
	}

	const compilerOptions = convertResult.config as ts.CompilerOptions;

	const output = {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		log: () => {},
		stderr: console.error.bind(console),
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		stdout: () => {},
	};

	const fileNameSuffix = originalFileName.endsWith("x") ? "x" : "";
	const originalFile = path.join(dirPath, originalFileName);
	const actualFileName = `actual.ts${fileNameSuffix}`;
	const actualFile = path.join(dirPath, actualFileName);

	await fs.copyFile(originalFile, actualFile);

	const provider = createTypeStatProvider({
		...fillOutRawOptions({
			compilerOptions,
			cwd: dirPath,
			output,
			projectPath,
			rawOptions,
		}),
		fileNames: [actualFile],
	});

	await runMutations({
		mutationsProvider: provider,
	});

	const actualContent = await readFile(actualFileName);
	const expectFileName = `expected.ts${fileNameSuffix}`;
	const expectedFilePath = path.join(dirPath, expectFileName);

	return { actualContent, expectedFilePath };
};
