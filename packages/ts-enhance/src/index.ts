import chalk from "chalk";
import { EOL } from "node:os";

import { runEnhance } from "./enhance/index.js";
import { runGuide } from "./guide/index.js";
import { ResultStatus, TSEnhanceArgv, TSEnhanceResult } from "./types.js";

export const runTSEnhance = async (argv: TSEnhanceArgv) => {
	let result: TSEnhanceResult;

	try {
		result = await (argv.config
			? runEnhance({ ...argv, config: argv.config })
			: runGuide(argv));
	} catch (error) {
		result = {
			error: error instanceof Error ? error : new Error(error as string),
			status: ResultStatus.Failed,
		};
	}

	switch (result.status) {
		case ResultStatus.ConfigurationError:
			argv.output.stderr(chalk.yellow(result.error));
			break;

		case ResultStatus.Failed:
			argv.output.stderr(chalk.yellow(result.error));
			break;

		case ResultStatus.Succeeded:
			argv.output.stdout(chalk.greenBright(`${EOL}All done! ✨`));
			break;
	}

	return result.status;
};
