import chalk from "chalk";
import { spawn } from "child_process";

import { TypeStatOptions } from "../../../options/types";

const isWindows = () => process.platform === "win32";

const commandAliases = new Map([["npm", isWindows() ? "npm.cmd" : undefined], ["yarn", isWindows() ? "yarn.cmd" : undefined]]);

/**
 * Runs a shell command.
 *
 * @param fullCommand   Command to spawnute, including args.
 * @returns Promise for the result code of the command.
 */
export const runCommand = async (options: TypeStatOptions, fullCommand: string) => {
    const [command, ...args] = fullCommand.split(" ");
    const commandAlias = getCommandAlias(command);

    options.logger.stdout.write(chalk.grey(`> ${commandAlias} ${args.join(" ")}\n`));

    return new Promise<number>(
        (resolve, reject): void => {
            const childProcess = spawn(commandAlias, args, {
                cwd: options.package.directory,
                stdio: "inherit",
            });

            childProcess.on("error", reject);
            childProcess.on("close", resolve);
        },
    );
};

const getCommandAlias = (command: string): string => {
    const alias = commandAliases.get(command);

    return alias === undefined ? command : alias;
};
