// Ensure TypeScript is exposed before any files import it
// eslint-disable-next-line @typescript-eslint/no-var-requires, import/extensions, n/no-missing-require
require("./mutations/createExposedTypeScript").requireExposedTypeScript();

import { runMutations } from "automutate";
import chalk from "chalk";
import { EOL } from "node:os";
import { pluralize } from "typestat-utils";

import { loadPendingOptions } from "../options/loadPendingOptions.js";
import { PendingTSEnhanceOptions } from "../options/types.js";
import { ResultStatus, RunEnhanceArgv, TSEnhanceResult } from "../types.js";
import { collectFileNames } from "./collectFileNames.js";
import { createTSEnhanceProvider } from "./runtime/createTSEnhanceProvider.js";

export const runEnhance = async (
	argv: RunEnhanceArgv,
): Promise<TSEnhanceResult> => {
	const allPendingOptions = await tryLoadingPendingOptions(argv);
	if (
		allPendingOptions instanceof Error ||
		typeof allPendingOptions === "string"
	) {
		return {
			error: allPendingOptions,
			status: ResultStatus.ConfigurationError,
		};
	}

	argv.output.stdout(
		[
			chalk.green(`ts-enhance will run through the `),
			chalk.greenBright(allPendingOptions.length),
			chalk.green(
				` options ${pluralize(
					allPendingOptions.length,
					"object",
				)} specified in `,
			),
			chalk.greenBright(argv.config),
			chalk.green(` to modify your source code.`),
		].join(""),
	);
	argv.output.stdout(chalk.greenBright(`This may take a while...${EOL}`));

	for (let i = 0; i < allPendingOptions.length; i += 1) {
		// Collect all files to be run on this option iteration from the include glob(s)
		const fileNames = await collectFileNames(
			process.cwd(),
			allPendingOptions[i].include,
		);
		if (typeof fileNames !== "object") {
			return {
				error: new Error(
					`Could not run options object ${i + 1}: ${
						fileNames ??
						`No files included by the 'include' setting were found.`
					}`,
				),
				status: ResultStatus.Failed,
			};
		}

		argv.output.stdout(
			[
				chalk.green(`${EOL}Starting options object `),
				chalk.greenBright(i + 1),
				chalk.green(" of "),
				chalk.greenBright(allPendingOptions.length),
				chalk.green(`.${EOL}`),
			].join(""),
		);

		// Run the mutation providers on those starting options and files
		try {
			await runMutations({
				mutationsProvider: createTSEnhanceProvider({
					...allPendingOptions[i],
					fileNames,
				}),
			});
		} catch (error) {
			return {
				error: error as Error,
				status: ResultStatus.Failed,
			};
		} finally {
			argv.output.stdout(
				[
					chalk.green(`Finished options object `),
					chalk.greenBright(i + 1),
					chalk.green(" of "),
					chalk.greenBright(allPendingOptions.length),
					chalk.green(`.${EOL}`),
				].join(""),
			);
		}
	}

	return {
		status: ResultStatus.Succeeded,
	};
};

const tryLoadingPendingOptions = async (
	argv: RunEnhanceArgv,
): Promise<Error | PendingTSEnhanceOptions[] | string> => {
	try {
		return await loadPendingOptions(argv);
	} catch (error) {
		return error instanceof Error ? error : new Error(error as string);
	}
};
