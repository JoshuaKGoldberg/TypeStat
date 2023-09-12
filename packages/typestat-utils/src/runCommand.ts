import chalk from "chalk";
import { spawn } from "child_process";

import { ProcessOutput } from "./output/types.js";

const isWindows = () => process.platform === "win32";

const commandAliases = new Map([
	["npm", isWindows() ? "npm.cmd" : undefined],
	["yarn", isWindows() ? "yarn.cmd" : undefined],
]);

export interface RunCommandOptions {
	cwd: string;
	output: ProcessOutput;
}

/**
 * Runs a shell command.
 * @param fullCommand   Command to spawn, including args.
 * @param options   Parsed runtime options for ts-enhance.
 * @returns Promise for the result code of the command.
 */
export const runCommand = async (
	fullCommand: string | string[],
	options: RunCommandOptions,
) => {
	const [command, ...args] =
		typeof fullCommand === "string" ? fullCommand.split(" ") : fullCommand;
	const commandAlias = getCommandAlias(command);

	options.output.stdout(chalk.grey(`> ${commandAlias} ${args.join(" ")}`));

	return new Promise<number>((resolve, reject): void => {
		const childProcess = spawn(commandAlias, args, {
			cwd: options.cwd,
			stdio: "inherit",
		});

		childProcess.on("error", reject);
		childProcess.on("close", resolve);
	});
};

const getCommandAlias = (command: string): string => {
	const alias = commandAliases.get(command);

	return alias ?? command;
};
