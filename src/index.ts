// Ensure TypeScript is exposed before any files import it
require("./mutations/createExposedTypeScript").requireExposedTypeScript();

import { runMutations } from "automutate";
import chalk from "chalk";
import { EOL } from "os";

import { loadPendingOptions } from "./options/loadPendingOptions";
import { pluralize } from "./output/pluralize";
import { ProcessOutput } from "./output/types";
import { PendingTypeStatOptions } from "./options/types";
import { createTypeStatProvider } from "./runtime/createTypeStatProvider";
import { collectFileNames } from "./collectFileNames";

/**
 * Root arguments to pass to TypeStat.
 */
export interface TypeStatArgv {
    args: string[];
    config?: string;
    logfile?: string;
}

export enum ResultStatus {
    Succeeded = 0,
    Failed = 1,
    ConfigurationError = 2,
}

export type TypeStatResult = ConfigurationErrorResult | FailedResult | SucceededResult;

export interface ConfigurationErrorResult {
    readonly error: Error | string;
    readonly status: ResultStatus.ConfigurationError;
}

export interface FailedResult {
    readonly error: Error | string;
    readonly status: ResultStatus.Failed;
}

export interface SucceededResult {
    readonly status: ResultStatus.Succeeded;
}

export const typeStat = async (argv: TypeStatArgv, output: ProcessOutput): Promise<TypeStatResult> => {
    const allPendingOptions = await tryLoadingPendingOptions(argv, output);
    if (allPendingOptions instanceof Error || typeof allPendingOptions === "string") {
        return {
            error: allPendingOptions,
            status: ResultStatus.ConfigurationError,
        };
    }

    output.stdout(chalk.greenBright("🚀 Welcome to TypeStat!"));
    output.stdout(chalk.yellowBright("⚠️ TypeStat is still very early stage and experimental. ⚠️"));
    output.stdout(chalk.yellowBright("While it will improve your code, it will likely add syntax and type errors."));
    output.stdout(chalk.yellowBright("Use TypeStat as a starting point before you manually fix and verify any changes."));

    output.stdout(
        [
            chalk.green(`TypeStat will run through the `),
            chalk.greenBright(allPendingOptions.length),
            chalk.green(` options ${pluralize(allPendingOptions.length, "object")} specified in `),
            chalk.greenBright(argv.config),
            chalk.green(` to modify your source code.`),
        ].join(""),
    );
    output.stdout(chalk.greenBright(`This may take a while...${EOL}`));

    for (let i = 0; i < allPendingOptions.length; i += 1) {
        // Collect all files to be run on this option iteration from the include glob(s)
        const fileNames = await collectFileNames(argv, process.cwd(), allPendingOptions[i].include);
        if (typeof fileNames !== "object") {
            return {
                error: new Error(
                    `Could not run options object ${i + 1}: ${fileNames ?? `No files included by the 'include' setting were found.`}`,
                ),
                status: ResultStatus.Failed,
            };
        }

        output.stdout(
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
                mutationsProvider: createTypeStatProvider({ ...allPendingOptions[i], fileNames }),
            });
        } catch (error) {
            return {
                error: error as Error,
                status: ResultStatus.Failed,
            };
        } finally {
            output.stdout(
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

const tryLoadingPendingOptions = async (argv: TypeStatArgv, output: ProcessOutput): Promise<PendingTypeStatOptions[] | Error | string> => {
    try {
        return await loadPendingOptions(argv, output);
    } catch (error) {
        return error instanceof Error ? error : new Error(error as string);
    }
};
