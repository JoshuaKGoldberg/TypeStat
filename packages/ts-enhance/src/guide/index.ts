import chalk from "chalk";
import { EOL } from "node:os";
import { getQuickErrorSummary } from "typestat-utils";

import { ResultStatus, TSEnhanceArgv, TSEnhanceResult } from "../types.js";
import { runPrompts } from "./prompts/index.js";

export const runGuide = async (
	argv: TSEnhanceArgv,
): Promise<TSEnhanceResult> => {
	argv.output.stdout(
		[
			chalk.greenBright("👋"),
			chalk.green(" Welcome to ts-enhance! "),
			chalk.greenBright("👋"),
			chalk.reset(""),
		].join(""),
	);

	argv.output.stdout(
		[
			chalk.reset(`This will create a new `),
			chalk.yellowBright("ts-enhance.json"),
			chalk.reset(` for you.`),
		].join(""),
	);

	try {
		await runPrompts(argv);
	} catch (error) {
		argv.output.stderr(getQuickErrorSummary(error));
		return {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			error: error instanceof Error ? error : new Error(`${error}`),
			status: ResultStatus.ConfigurationError,
		};
	}

	argv.output.stdout(chalk.reset(`${EOL}Awesome! You're now ready to:`));
	argv.output.stdout(
		chalk.greenBright(`npx ts-enhance --config ts-enhance.json`),
	);
	argv.output.stdout(
		chalk.reset(
			`${EOL}Once you run that, ts-enhance will start auto-fixing your typings.`,
		),
	);
	argv.output.stdout(
		[
			chalk.yellow(
				`Please report any bugs on https://github.com/JoshuaKGoldberg/TypeStat! `,
			),
			chalk.yellowBright("💖"),
		].join(""),
	);
	argv.output.stdout(chalk.reset(""));

	return {
		status: ResultStatus.Succeeded,
	};
};
