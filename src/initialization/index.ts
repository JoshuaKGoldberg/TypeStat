import chalk from "chalk";
import { EOL } from "os";

import { ResultStatus } from "../index.js";
import { ProcessOutput } from "../output/types.js";
import { getQuickErrorSummary } from "../shared/errors.js";
import { initializeJavaScript } from "./initializeJavaScript/index.js";
import { initializeProject } from "./initializeProject/index.js";
import {
	InitializationPurpose,
	initializePurpose,
} from "./initializePurpose/index.js";
import { initializeTypeScript } from "./initializeTypeScript/index.js";

const fileName = "typestat.json";

export interface FailedInitialization {
	status: ResultStatus.ConfigurationError;
}

export type InitializationResults =
	| FailedInitialization
	| RanInitializationResults;

export interface RanInitializationResults {
	skipped: boolean;
	status: ResultStatus.Failed | ResultStatus.Succeeded;
}

export const initialization = async (
	output: ProcessOutput,
): Promise<InitializationResults> => {
	output.stdout(
		[
			chalk.greenBright("👋"),
			chalk.green(" Welcome to TypeStat! "),
			chalk.greenBright("👋"),
			chalk.reset(""),
		].join(""),
	);

	output.stdout(
		[
			chalk.reset(`This will create a new `),
			chalk.yellowBright(fileName),
			chalk.reset(` for you.`),
		].join(""),
	);

	output.stdout(
		`If you don't know how to answer, that's ok - just select the default answer.`,
	);
	output.stdout(chalk.reset(""));

	let skipped: boolean;

	try {
		skipped = await runPrompts();
	} catch (error) {
		output.stderr(getQuickErrorSummary(error));
		return {
			status: ResultStatus.ConfigurationError,
		};
	}

	if (!skipped) {
		output.stdout(chalk.reset(`${EOL}Awesome! You're now ready to:`));
		output.stdout(chalk.greenBright(`npx typestat --config ${fileName}`));
		output.stdout(
			chalk.reset(
				`${EOL}Once you run that, TypeStat will start auto-fixing your typings.`,
			),
		);
		output.stdout(
			[
				chalk.yellow(
					`Please report any bugs on https://github.com/JoshuaKGoldberg/TypeStat! `,
				),
				chalk.yellowBright("💖"),
			].join(""),
		);
	}

	output.stdout(chalk.reset(""));

	return {
		skipped,
		status: ResultStatus.Succeeded,
	};
};

const runPrompts = async () => {
	const purpose = await initializePurpose();
	if (purpose === InitializationPurpose.Skipped) {
		return true;
	}

	const project = await initializeProject();
	await (
		purpose === InitializationPurpose.ConvertJavaScript
			? initializeJavaScript
			: initializeTypeScript
	)({ fileName, project });

	return false;
};
