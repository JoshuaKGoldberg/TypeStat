import * as path from "node:path";

import { normalizeAndSlashify } from "../shared/paths.js";
import { RunEnhanceArgv } from "../types.js";
import { fillOutRawOptions } from "./fillOutRawOptions.js";
import { findRawOptions } from "./findRawOptions.js";
import { findComplaintForOptions } from "./optionVerification.js";
import { parseRawCompilerOptions } from "./parseRawCompilerOptions.js";
import { PendingTSEnhanceOptions, RawTSEnhanceOptions } from "./types.js";

/**
 * Reads pre-file-rename ts-enhance options using a config path.
 * @param argv   Root arguments passed to ts-enhance.
 * @returns Promise for filled-out ts-enhance options, or a string complaint from failing to make them.
 */
export const loadPendingOptions = async (
	argv: RunEnhanceArgv,
): Promise<PendingTSEnhanceOptions[] | string> => {
	const cwd = process.cwd();
	const foundRawOptions = findRawOptions(cwd, argv.config);
	if (typeof foundRawOptions === "string") {
		return foundRawOptions;
	}

	const { allRawOptions, filePath } = foundRawOptions;
	const results: PendingTSEnhanceOptions[] = [];

	// Fill out each option in the config with its own separate settings
	// (or return the first failure string describing which one is incorrect)
	for (let i = 0; i < allRawOptions.length; i += 1) {
		const rawOptions = allRawOptions[i];
		const projectPath = getProjectPath(cwd, filePath, rawOptions);
		const compilerOptions = await parseRawCompilerOptions(cwd, projectPath);

		const filledOutOptions = await fillOutRawOptions({
			compilerOptions,
			cwd,
			output: argv.output,
			projectPath,
			rawOptions,
		});
		const complaint = findComplaintForOptions(filledOutOptions);
		if (complaint) {
			return `Invalid options at index ${i}: ${complaint}`;
		}

		results.push(filledOutOptions);
	}

	return results;
};

const getProjectPath = (
	cwd: string,
	filePath: string | undefined,
	rawOptions: RawTSEnhanceOptions,
): string => {
	// If the ts-enhance configuration file has a projectPath field, use that relative to the file
	if (filePath !== undefined && rawOptions.projectPath !== undefined) {
		return normalizeAndSlashify(
			path.join(path.dirname(filePath), rawOptions.projectPath),
		);
	}

	// Otherwise give up and try a ./tsconfig.json relative to the package directory
	return normalizeAndSlashify(path.join(cwd, "tsconfig.json"));
};
