import * as commander from "commander";

import { ResultStatus, typeStat, TypeStatResult } from "../index";
import { getPackageVersion } from "./version";

// tslint:disable:no-console

export interface ParsedCliArgv {
    readonly args?: ReadonlyArray<string>;
    readonly config?: string;
    readonly fixIncompleteTypes?: boolean;
    readonly fixNoImplicitAny?: boolean;
    readonly fixNoImplicitThis?: boolean;
    readonly fixStrictNullChecks?: boolean;
    readonly project?: string;
}

/**
 * Parses raw string arguments and, if they're valid, calls to a main method.
 *
 * @param dependencies   Raw string arguments and any system dependency overrides.
 * @returns Promise for the result of the main method.
 */
export const cli = async (argv: ReadonlyArray<string>): Promise<void> => {
    const command = new commander.Command()
        .option("-c, --config [config]", "path to a TypeStat config file")
        .option("-p, --project [project]", "path to a TypeScript project file")
        .option("--fixIncompleteTypes [fixIncompleteTypes]", "add missing types to existing, incomplete types")
        .option("--fixNoImplicitAny [fixNoImplicitAny]", "fix TypeScript's --noImplicitAny complaints")
        .option("--fixNoImplicitThis [fixNoImplicitThis]", "fix TypeScript's --strictNullChecks complaints")
        .option("--fixStrictNullChecks [fixStrictNullChecks]", "override TypeScript's --strictNullChecks setting for added types")
        .option("-V, --version", "output the package version");
    const parsed = command.parse(argv as string[]) as ParsedCliArgv;

    if ({}.hasOwnProperty.call(parsed, "version")) {
        console.log(await getPackageVersion());
        return;
    }

    let result: TypeStatResult;

    try {
        result = await typeStat(parsed);
    } catch (error) {
        result = {
            error,
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
