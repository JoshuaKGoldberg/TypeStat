import chalk from "chalk";

import { getPackageVersion } from "./getPackageVersion.js";
import { runTSEnhance } from "./index.js";
import { parseEnhanceArgv } from "./parseEnhanceArgv.js";

export const bin = async (args: string[], cwd: string) => {
	const argv = parseEnhanceArgv(args, cwd);
	if (argv.version) {
		argv.output.stdout(await getPackageVersion());
		return 0;
	}

	argv.output.stdout(chalk.greenBright("💗 Welcome to ts-enhance!\n"));

	argv.output.stdout(
		chalk.yellowBright(
			"⚠️ ts-enhance is still very early stage and experimental. ⚠️\n",
		),
	);
	argv.output.stdout(
		chalk.yellowBright(
			"While it may improve your code, it will likely add syntax and type errors.\n",
		),
	);
	argv.output.stdout(
		chalk.yellowBright(
			"Use ts-enhance as a starting point before you manually fix and verify any changes.\n",
		),
	);

	return await runTSEnhance(argv);
};
