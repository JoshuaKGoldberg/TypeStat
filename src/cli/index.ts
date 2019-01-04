import chalk from "chalk";
import { Command } from "commander";

import { ResultStatus, typeStat, TypeStatArgv, TypeStatResult } from "../index";
import { getPackageVersion } from "./version";

// tslint:disable:no-console

/**
 * Parses raw string arguments and, if they're valid, calls to a main method.
 *
 * @param dependencies   Raw string arguments and any system dependency overrides.
 * @returns Promise for the result of running TypeStat.
 */
export const cli = async (argv: ReadonlyArray<string>): Promise<void> => {
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
    const parsed = command.parse(argv as string[]) as TypeStatArgv;

    if ({}.hasOwnProperty.call(parsed, "version")) {
        console.log(await getPackageVersion());
        return;
    }

    let result: TypeStatResult;

    try {
        result = await typeStat(parsed);
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
        console.log("");
    }

    console.error(chalk.yellow(`${result.error}`));
    process.exit(1);
};
