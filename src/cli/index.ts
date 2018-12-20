import { Command } from "commander";

import { ResultStatus, typeStat, TypeStatArgv, TypeStatResult } from "../index";
import { getPackageVersion } from "./version";

// tslint:disable:no-console

/**
 * Parses raw string arguments and, if they're valid, calls to a main method.
 *
 * @param dependencies   Raw string arguments and any system dependency overrides.
 * @returns Promise for the result of the main method.
 */
export const cli = async (argv: ReadonlyArray<string>): Promise<void> => {
    const command = new Command()
        .option("-c --config [config]", "path to a TypeStat config file")
        .option("-f --filter [...filters]", "tsquery filters to exclude within files")
        .option("-m --mutators [...mutators]", "require paths to any custom mutators to run")
        .option("-p --project [project]", "path to a TypeScript project file")
        .option("--fixIncompleteTypes", "add missing types to existing, incomplete types")
        .option("--fixNoImplicitAny", "fix TypeScript's --noImplicitAny complaints")
        .option("--fixNoImplicitThis", "fix TypeScript's --strictNullChecks complaints")
        .option("--fixStrictNullChecks", "override TypeScript's --strictNullChecks setting for added types")
        .option("--typesOnlyPrimitives", "exclude complex types from changes, such as arrays or interfaces")
        .option("-V --version", "output the package version");
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

    console.error(result.error);
    process.exit(1);
};
