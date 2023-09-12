import * as path from "node:path";
import { ProcessOutput, getQuickErrorSummary } from "typestat-utils";

import { builtInFileMutators } from "../../mutators/builtIn/index.js";
import { collectOptionals } from "../../shared/arrays.js";
import { FileMutator } from "../../shared/fileMutator.js";
import { RawTSEnhanceOptions } from "../types.js";

interface ImportedFileMutator {
	fileMutator: FileMutator;
}

/**
 * Finds mutators to use in runtime, as either the built-in mutators or custom mutators specified by the user.
 * @param rawOptions   Options listed as JSON in a typestat configuration file.
 * @param packageDirectory   Base directory to resolve paths from.
 * @param output   Wraps process.stderr and process.stdout.
 * @returns Mutators to run with their friendly names.
 */
export const collectAddedMutators = async (
	rawOptions: RawTSEnhanceOptions,
	packageDirectory: string,
	output: ProcessOutput,
): Promise<readonly [string, FileMutator][]> => {
	const addedMutators = collectOptionals(rawOptions.mutators);
	if (addedMutators.length === 0) {
		return builtInFileMutators;
	}

	const additions: [string, FileMutator][] = [];
	for (const rawAddedMutator of addedMutators) {
		try {
			const addedMutator = await collectAddedMutator(
				packageDirectory,
				rawAddedMutator,
				output,
			);

			if (addedMutator !== undefined) {
				additions.push([rawAddedMutator, addedMutator]);
			}
		} catch (error) {
			output.stderr(
				`Could not require ${rawAddedMutator} from ${packageDirectory}.`,
			);
			output.stderr(getQuickErrorSummary(error));
		}
	}

	return additions;
};

const collectAddedMutator = async (
	packageDirectory: string,
	rawAddedMutator: string,
	output: ProcessOutput,
): Promise<FileMutator | undefined> => {
	const requiringPath = path.join(packageDirectory, rawAddedMutator);
	const resolvedImport = tryRequireResolve(requiringPath);
	if (resolvedImport === undefined) {
		output.stderr(
			`Could not require ${rawAddedMutator} at ${requiringPath} from ${packageDirectory}.`,
		);
		output.stderr("It doesn't seem to exist? :(");
		return undefined;
	}

	const result = (await import(requiringPath)) as Partial<ImportedFileMutator>;

	if (typeof result.fileMutator !== "function") {
		output.stderr(
			`Could not require ${rawAddedMutator} from ${packageDirectory}.`,
		);

		if ((result.fileMutator as unknown) === undefined) {
			output.stderr(
				`It doesn't have an exported .fileMutator, which must be a function.`,
			);
		} else {
			output.stderr(
				`Its exported .fileMutator is ${typeof result.fileMutator} instead of function.`,
			);
		}

		return undefined;
	}

	return result.fileMutator;
};

const tryRequireResolve = (requiringPath: string): string | undefined => {
	try {
		return require.resolve(requiringPath);
	} catch {
		return undefined;
	}
};
