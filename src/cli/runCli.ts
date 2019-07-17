// Ensure TypeScript is exposed before any files import it
// tslint:disable-next-line
require("../mutations/createExposedTypeScript").requireExposedTypeScript();

import chalk from "chalk";
import { Command } from "commander";
import * as fs from "mz/fs";
import * as path from "path";

import { ResultStatus, typeStat, TypeStatArgv, TypeStatResult } from "../index";
import { initialization } from "../initialization";
import { processLogger } from "../logging/logger";

import { captureHelp } from "./captureHelp";

const createDefaultRuntime = () => ({
    initializationRunner: initialization,
    logger: processLogger,
    mainRunner: typeStat,
});

/**
 * Parses raw string arguments and, if they're valid, calls to a main method.
 *
 * @param rawArgv   Raw string arguments and any system dependency overrides.
 * @param mainRunner   Method to run with parsed arguments: generally `typeStat`.
 * @returns Promise for the result of running TypeStat.
 */
export const runCli = async (rawArgv: ReadonlyArray<string>, runtime = createDefaultRuntime()): Promise<ResultStatus> => {
    if (rawArgv.length === 2) {
        return runtime.initializationRunner(runtime.logger);
    }

    const command = new Command()
        .option("-c --config [config]", "path to a TypeStat config file")
        .option("-i --init [init]", "run config initialization wizard")
        .option("-m --mutator [...mutator]", "require paths to any custom mutators to run")
        .option("-V --version", "output the package version");
    const parsedArgv = {
        ...(command.parse(rawArgv as string[]) as Partial<TypeStatArgv>),
        logger: runtime.logger,
    };

    if ({}.hasOwnProperty.call(parsedArgv, "version")) {
        runtime.logger.stdout.write(`${await getPackageVersion()}\n`);
        return ResultStatus.Succeeded;
    }

    if ({}.hasOwnProperty.call(parsedArgv, "init")) {
        return initialization(runtime.logger);
    }

    let result: TypeStatResult;

    try {
        result = await runtime.mainRunner(parsedArgv);
    } catch (error) {
        result = {
            error: error instanceof Error ? error : new Error(error as string),
            status: ResultStatus.Failed,
        };
    }

    switch (result.status) {
        case ResultStatus.ConfigurationError:
            const helpText = await captureHelp(command);
            runtime.logger.stdout.write(`${helpText}\n`);
            runtime.logger.stderr.write(chalk.yellow(`${result.error}\n`));
            break;

        case ResultStatus.Failed:
            runtime.logger.stderr.write(chalk.yellow(`${result.error}\n`));
            break;
    }

    return result.status;
};

const getPackageVersion = async (): Promise<string> => {
    const packagePath = path.join(__dirname, "../../package.json");
    const rawText = (await fs.readFile(packagePath)).toString();

    return (JSON.parse(rawText) as { version: string }).version;
};
