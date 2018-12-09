import * as commander from "commander";

import { typeStat } from "../index";
import { getPackageVersion } from "./version";

// tslint:disable:no-console

interface ParsedArgv {
    readonly config?: string;
}

/**
 * Parses raw string arguments and, if they're valid, calls to a main method.
 *
 * @param dependencies   Raw string arguments and any system dependency overrides.
 * @returns Promise for the result of the main method.
 */
export const cli = async (argv: ReadonlyArray<string>): Promise<void> => {
    const command = new commander.Command()
        .option("-c, --config [config]", "path to a config file")
        .option("-V, --version", "output the package version")
        .parse(argv as string[]) as ParsedArgv;

    if ({}.hasOwnProperty.call(command, "version")) {
        console.log(await getPackageVersion());
        return;
    }

    let runtimeError: Error | undefined;

    try {
        const result = await typeStat({
            configPath: command.config,
        });

        if (!result.succeeded) {
            runtimeError = result.error;
        }
    } catch (error) {
        runtimeError = error;
    }

    if (runtimeError !== undefined) {
        console.error(runtimeError);
        process.exit(1);
    }
};
