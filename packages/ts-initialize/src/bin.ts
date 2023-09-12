import chalk from "chalk";

import { createRerunSuggestion } from "./createRerunSuggestion.js";
import { runTSInitialize } from "./index.js";
import { promptForOptions } from "./prompts/promptForOptions.js";

export async function bin(args: string[], cwd: string) {
	console.log(chalk.greenBright("💝 Welcome to ts-initialize!"));

	console.log(
		chalk.yellowBright(
			"⚠️ ts-initialize is still very early stage and experimental. ⚠️",
		),
	);
	console.log(
		chalk.yellowBright(
			"Use ts-initialize as a starting point before you manually fix and verify any changes.",
		),
	);

	const options = await promptForOptions(args, cwd);
	const code = await runTSInitialize(options);

	console.log(
		[
			chalk.italic(`Tip: to run again with the same input values, use:`),
			chalk.blue(createRerunSuggestion(options)),
		].join(" "),
	);

	return code;
}
