import * as path from "node:path";

import { ProcessOutput } from "../output/types.js";
import { normalizeAndSlashify } from "../shared/paths.js";
import { fillOutRawOptions } from "./fillOutRawOptions.js";
import { findRawOptions } from "./findRawOptions.js";
import { findComplaintForOptions } from "./optionVerification.js";
import { parseRawCompilerOptions } from "./parseRawCompilerOptions.js";
import { PendingTypeStatOptions, RawTypeStatOptions } from "./types.js";

/**
 * Reads pre-file-rename TypeStat options using a config path.
 * @param configPath   Config path
 * @param output   Wraps process and logfile output.
 * @returns Promise for filled-out TypeStat options, or a string complaint from failing to make them.
 */
export const loadPendingOptions = async (
	configPath: string | undefined,
	output: ProcessOutput,
): Promise<PendingTypeStatOptions[] | string> => {
	if (configPath === undefined) {
		return "-c/--config file must be provided.";
	}

	const cwd = process.cwd();
	const foundRawOptions = findRawOptions(cwd, configPath);
	if (typeof foundRawOptions === "string") {
		return foundRawOptions;
	}

	const { allRawOptions, filePath } = foundRawOptions;
	const results: PendingTypeStatOptions[] = [];

	// Fill out each option in the config with its own separate settings
	// (or return the first failure string describing which one is incorrect)
	for (let i = 0; i < allRawOptions.length; i += 1) {
		const rawOptions = allRawOptions[i];
		const projectPath = getProjectPath(cwd, filePath, rawOptions);
		const compilerOptions = await parseRawCompilerOptions(cwd, projectPath);

		const filledOutOptions = fillOutRawOptions({
			compilerOptions,
			cwd,
			output,
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
	rawOptions: RawTypeStatOptions,
): string => {
	// If the TypeStat configuration file has a projectPath field, use that relative to the file
	if (filePath !== undefined && rawOptions.projectPath !== undefined) {
		return normalizeAndSlashify(
			path.join(path.dirname(filePath), rawOptions.projectPath),
		);
	}

	// Otherwise give up and try a ./tsconfig.json relative to the package directory
	return normalizeAndSlashify(path.join(cwd, "tsconfig.json"));
};
