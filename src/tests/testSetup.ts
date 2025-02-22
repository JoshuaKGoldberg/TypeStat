import { runMutations } from "automutate";
import fs from "node:fs/promises";
import path from "node:path";
import { expect } from "vitest";

import { loadPendingOptions } from "../options/loadPendingOptions.js";
import { ProcessOutput } from "../output/types.js";
import { createTypeStatProvider } from "../runtime/createTypeStatProvider.js";

export interface MutationTestResult {
	actualContent: string;
	expectedFilePath: string;
	options: string;
	output: string;
}

export const runMutationTest = async (
	dirPath: string,
): Promise<MutationTestResult> => {
	const originalFileName = (await fs.readdir(dirPath)).find((file) =>
		file.startsWith("original."),
	);
	if (!originalFileName) {
		throw new Error(`${dirPath} should have a file named original.*`);
	}

	const readFile = (filename: string) =>
		fs.readFile(path.join(dirPath, filename), "utf-8");

	const originalFile = path.join(dirPath, originalFileName);
	const fileNameSuffix = originalFileName.endsWith("x") ? "x" : "";
	const actualFileName = `actual.ts${fileNameSuffix}`;
	const actualFile = path.join(dirPath, actualFileName);
	// file needs to exists before creating compiler options
	await fs.copyFile(originalFile, actualFile);

	const replaceFilePath = (value: string) =>
		value.replaceAll(dirPath, "<rootDir>");

	const cliOutput: string[] = [];

	const output: ProcessOutput = {
		log: (line: string) => {
			if (
				line.includes("text-insert") ||
				line.includes("text-delete") ||
				line.includes("text-swap")
			) {
				const index = line.indexOf("[");
				line = line.slice(0, index) + "[mutations]";
			}
			cliOutput.push("[log] " + replaceFilePath(line));
		},
		stderr: console.error.bind(console),
		stdout: (line: string) => {
			cliOutput.push("[stdout] " + replaceFilePath(line));
		},
	};

	const pendingOptionsList = loadPendingOptions(
		"typestat.json",
		dirPath,
		output,
	);

	if (typeof pendingOptionsList === "string") {
		throw new Error("setting file missing");
	}

	for (const pendingOptions of pendingOptionsList) {
		await runMutations({
			mutationsProvider: createTypeStatProvider({
				...pendingOptions,
				fileNames: [actualFile],
			}),
		});
	}

	const actualContent = await readFile(actualFileName);
	const expectFileName = `expected.ts${fileNameSuffix}`;
	const expectedFilePath = path.join(dirPath, expectFileName);
	const optionsSnapshot = JSON.stringify(pendingOptionsList, null, 2);

	return {
		actualContent,
		expectedFilePath,
		options: replaceFilePath(optionsSnapshot),
		output: cliOutput.join("\n"),
	};
};

export const checkTestResult = async (cwd: string, caseDir: string) => {
	const fullPath = path.join(cwd, "cases", caseDir);
	const { actualContent, expectedFilePath, options, output } =
		await runMutationTest(fullPath);
	await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	expect(options).toMatchSnapshot("options");
	expect(output).toMatchSnapshot("output");
};
