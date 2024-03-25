import { createSingleUseProvider } from "../createSingleUseProvider.js";
import { runCommand } from "./missingTypes/runCommand.js";

/**
 * Creates a mutations provider to run any post-processing shell scripts.
 * @param allModifiedFilePaths   Unique names of all files that were modified.
 * @returns Mutations provider to run post-processing shell scripts, if needed.
 */
export const createPostProcessingProvider = (
	allModifiedFilePaths: ReadonlySet<string>,
) => {
	return createSingleUseProvider(
		"Running post-processing scripts",
		(options) => {
			if (options.postProcess.shell.length === 0) {
				return undefined;
			}

			return async () => {
				for (const shellCommand of options.postProcess.shell) {
					await runCommand(options, [
						...shellCommand,
						...Array.from(allModifiedFilePaths),
					]);
				}

				return {
					mutationsWave: {},
				};
			};
		},
	);
};
