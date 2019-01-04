import chalk from "chalk";
import { Command } from "commander";
import * as fs from "mz/fs";
import * as path from "path";

import { ResultStatus, typeStat, TypeStatArgv, TypeStatResult } from "../index";
import { processLogger } from "../logging/logger";

const createDefaultRuntime = () => ({
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
export const cli = async (rawArgv: ReadonlyArray<string>, runtime = createDefaultRuntime()): Promise<void> => {
    const command = new Command()
        .option("-c --config [config]", "path to a TypeStat config file")
        .option("-m --mutator [...mutator]", "require paths to any custom mutators to run")
        .option("-p --project [project]", "path to a TypeScript project file")
        .option("-V --version", "output the package version")
        .option("--filter [...filter]", "tsquery filters to exclude within files")
        .option("--fixIncompleteTypes", "add missing types to existing, incomplete types")
        .option("--fixMissingProperties", "add missing properties to classes from usage")
        .option("--fixNoImplicitAny", "fix TypeScript's --noImplicitAny complaints")
        .option("--fixNoImplicitThis", "fix TypeScript's --strictNullChecks complaints")
        .option(
            "--fixStrictNonNullAssertions",
            "add missing non-null assertions in nullable property accesses, function-like calls, and return types",
        )
        .option("--typeAlias [...typeAlias]", "add a key=value to replace added type names with")
        .option("--typeMatching [...typeMatching]", "regular expression matchers added types must match.")
        .option("--typeStrictNullChecks", "override TypeScript's --strictNullChecks setting for types")
        .option("--typeOnlyPrimitives", "exclude complex types from changes, such as arrays or interfaces");
    const parsedArgv: TypeStatArgv = {
        ...(command.parse(rawArgv as string[]) as Partial<TypeStatArgv>),
        logger: runtime.logger,
    };

    if ({}.hasOwnProperty.call(parsedArgv, "version")) {
        runtime.logger.stdout.write(`${await getPackageVersion()}\n`);
        return;
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

    if (result.status === ResultStatus.Succeeded) {
        return;
    }

    if (result.status === ResultStatus.ConfigurationError) {
        command.outputHelp();
        runtime.logger.stdout.write("\n");
    }

    runtime.logger.stderr.write(chalk.yellow(`${result.error}\n`));
    process.exit(1);
};

const getPackageVersion = async (): Promise<string> => {
    const packagePath = path.join(__dirname, "../../package.json");
    const rawText = (await fs.readFile(packagePath)).toString();

    return (JSON.parse(rawText) as { version: string }).version;
};
