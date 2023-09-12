import { glob } from "glob";
import path from "node:path";
import { parseArgs } from "node:util";
import { createProcessOutput } from "typestat-utils";

import {
	FileExtensions,
	PackageManager,
	TSConfigEmit,
	TSConfigJSX,
	TSConfigModuleResolution,
	TSConfigTarget,
	TSInitializeOptions,
} from "../types.js";
import { promptIfNotProvided } from "./promptIfNotProvided.js";
import { promptIfNotProvidedSelect } from "./promptIfNotProvidedSelect.js";

export const promptForOptions = async (
	args: string[],
	cwd: string,
): Promise<TSInitializeOptions> => {
	const { values } = parseArgs({
		args,
		options: {
			"file-extensions": { type: "string" },
			files: { multiple: true, type: "string" },
			logfile: { short: "l", type: "string" },
			"package-manager": { type: "string" },
			"tsconfig-dom": { type: "boolean" },
			"tsconfig-emit": { type: "string" },
			"tsconfig-jsx": { type: "string" },
			"tsconfig-module-resolution": { type: "string" },
			"tsconfig-target": { type: "string" },
		},
	});

	// TODO: Zod?
	// TODO: eventually, this should be switched to auto-detecting everything...
	return {
		cwd,
		fileExtensions: await promptIfNotProvidedSelect(
			values["file-extensions"],
			FileExtensions,
			"Should TypeScript output .js files from .ts sources?",
		),
		filePaths: await glob(
			(
				await promptIfNotProvided(values.files, {
					message: "What glob(s) match source files to convert?",
					type: "string",
				})
			)
				.flatMap((subInclude) => subInclude.split(/\s+/))
				.map((subInclude) => path.join(cwd, subInclude)),
		),
		output: createProcessOutput(values.logfile),
		packageManager: await promptIfNotProvidedSelect(
			values["package-manager"],
			PackageManager,
			"What package manager should be used to install @types/ packages?",
		),
		tsconfig: {
			dom: await promptIfNotProvided(values["tsconfig-dom"], {
				message: "Will your code run in a browser?",
				type: "boolean",
			}),
			emit: await promptIfNotProvidedSelect(
				values["tsconfig-emit"],
				TSConfigEmit,
				"Should TypeScript output JS files from TS sources?",
			),
			jsx: await promptIfNotProvidedSelect(
				values["tsconfig-jsx"],
				TSConfigJSX,
				"Does your project use JSX?",
			),
			moduleResolution: await promptIfNotProvidedSelect(
				values["tsconfig-module-resolution"],
				TSConfigModuleResolution,
				"Do module imports resolve using a bundler (ESBuild, Webpack, etc.) or natively in Node?",
			),
			target: await promptIfNotProvidedSelect(
				values["tsconfig-target"],
				TSConfigTarget,
				"What minimum runtime version will your code run on??",
			),
		},
	};
};
