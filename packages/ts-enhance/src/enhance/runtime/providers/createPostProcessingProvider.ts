import { runCommand } from "typestat-utils";

import { createSingleUseProvider } from "../createSingleUseProvider.js";

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
					await runCommand(
						[...shellCommand, ...Array.from(allModifiedFilePaths)],
						{
							cwd: options.package.directory,
							output: options.output,
						},
					);
				}

				return {
					mutationsWave: {},
				};
			};
		},
	);
};
