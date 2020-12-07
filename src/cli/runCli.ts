// Ensure TypeScript is exposed before any files import it
require("../mutations/createExposedTypeScript").requireExposedTypeScript();

import chalk from "chalk";
import { Command } from "commander";
import * as fs from "mz/fs";
import * as path from "path";

import { ResultStatus, typeStat, TypeStatArgv, TypeStatResult } from "../index";
import { initialization } from "../initialization";
import { createProcessOutput, ProcessOutput } from "../output";

import { captureHelp } from "./captureHelp";

export interface CliRuntime {
    initializationRunner: typeof initialization;
    output: ProcessOutput;
    mainRunner: typeof typeStat;
}

/**
 * Parses raw string arguments and, if they're valid, calls to a main method.
 *
 * @param rawArgv   Raw string arguments and any system dependency overrides.
 * @param mainRunner   Method to run with parsed arguments: generally `typeStat`.
 * @returns Promise for the result of running TypeStat.
 */
export const runCli = async (rawArgv: ReadonlyArray<string>, runtime?: CliRuntime): Promise<ResultStatus> => {
    const command = new Command()
        .storeOptionsAsProperties(true)
        .option("-c --config [config]", "path to a TypeStat config file")
        .option("-l --logfile [logfile]", "paths to a logfile to ")
        .option("-V --version", "output the package version");

    const rawOptions = command.parse(rawArgv as string[]) as TypeStatArgv;
    runtime ??= {
        initializationRunner: initialization,
        output: createProcessOutput(rawOptions.logfile),
        mainRunner: typeStat,
    };

    if (rawArgv.length === 2) {
        const initialized = await runtime.initializationRunner(runtime.output);
        if (initialized.status !== ResultStatus.Succeeded || !initialized.skipped) {
            return initialized.status;
        }

        rawOptions.config = "typestat.json";
    }

    if ({}.hasOwnProperty.call(rawOptions, "version")) {
        runtime.output.stdout(await getPackageVersion());
        return ResultStatus.Succeeded;
    }

    let result: TypeStatResult;

    try {
        result = await runtime.mainRunner(rawOptions, runtime.output);
    } catch (error) {
        result = {
            error: error instanceof Error ? error : new Error(error as string),
            status: ResultStatus.Failed,
        };
    }

    switch (result.status) {
        case ResultStatus.ConfigurationError:
            const helpText = await captureHelp(command);
            runtime.output.stdout(helpText);
            runtime.output.stderr(chalk.yellow(result.error));
            break;

        case ResultStatus.Failed:
            runtime.output.stderr(chalk.yellow(result.error));
            break;

        case ResultStatus.Succeeded:
            runtime.output.stdout(chalk.blue("All done! ✨"));
            break;
    }

    return result.status;
};

const getPackageVersion = async (): Promise<string> => {
    const packagePath = path.join(__dirname, "../../package.json");
    const rawText = (await fs.readFile(packagePath)).toString();

    return (JSON.parse(rawText) as { version: string }).version;
};
