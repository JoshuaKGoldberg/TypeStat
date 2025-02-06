import { runMutations } from "automutate";
import fs from "node:fs/promises";
import path from "node:path";

import { loadPendingOptions } from "../options/loadPendingOptions.js";
import { createTypeStatProvider } from "../runtime/createTypeStatProvider.js";

export interface MutationTestResult {
	actualContent: string;
	expectedFilePath: string;
	options: string;
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

	const output = {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		log: () => {},
		stderr: console.error.bind(console),
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		stdout: () => {},
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

	const optionsSnapshot = JSON.stringify(
		pendingOptionsList,
		null,
		2,
	).replaceAll(dirPath, "<rootDir>");

	return { actualContent, expectedFilePath, options: optionsSnapshot };
};
