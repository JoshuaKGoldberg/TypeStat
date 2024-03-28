import { runMutations } from "automutate";
import * as fs from "fs";
import path from "path";
import ts from "typescript";

import { fillOutRawOptions } from "../options/fillOutRawOptions.js";
import { RawTypeStatOptions } from "../options/types.js";
import { createTypeStatProvider } from "../runtime/createTypeStatProvider.js";

export const runMutationForTest = async (
	dirPath: string,
	originalFileName = "original.ts",
) => {
	const typestatPath = path.join(dirPath, "typestat.json");

	const projectPath = path.join(dirPath, "tsconfig.json");
	const rawCompilerOptions = fs.readFileSync(typestatPath).toString();
	const rawOptions = JSON.parse(rawCompilerOptions) as RawTypeStatOptions;
	const compilerOptions = (
		ts.parseConfigFileTextToJson(dirPath, rawCompilerOptions) as {
			config: ts.CompilerOptions;
		}
	).config;

	const output = {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		log: () => {},
		stderr: console.error.bind(console),
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		stdout: () => {},
	};

	const originalFile = path.join(dirPath, originalFileName);
	const actualFileName = originalFileName.endsWith("x")
		? "actual.tsx"
		: "actual.ts";
	const actualFile = path.join(dirPath, actualFileName);

	fs.copyFileSync(originalFile, actualFile);

	const provider = createTypeStatProvider({
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
		fileNames: [actualFile],
	});

	await runMutations({
		mutationsProvider: provider,
	});

	return fs.readFileSync(actualFile).toString();
};
