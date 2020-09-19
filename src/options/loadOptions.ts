import * as path from "path";

import { TypeStatArgv } from "../index";
import { globAllAsync } from "../shared/glob";
import { normalizeAndSlashify } from "../shared/paths";

import { fillOutRawOptions } from "./fillOutRawOptions";
import { findRawOptions } from "./findRawOptions";
import { findComplaintForOptions } from "./optionVerification";
import { parseRawCompilerOptions } from "./parseRawCompilerOptions";
import { RawTypeStatOptions, TypeStatOptions } from "./types";

/**
 * Reads TypeStat options using a config path.
 *
 * @param argv   Root arguments passed to TypeStat
 * @returns Promise for filled-out TypeStat options, or a string complaint from failing to make them.
 */
export const loadOptions = async (argv: TypeStatArgv): Promise<TypeStatOptions[] | string> => {
    if (argv.config === undefined) {
        return "-c/--config file must be provided.";
    }

    const cwd = process.cwd();
    const foundRawOptions = await findRawOptions(cwd, argv.config);
    if (typeof foundRawOptions === "string") {
        return foundRawOptions;
    }

    const { allRawOptions, filePath } = foundRawOptions;
    const results: TypeStatOptions[] = [];

    // Fill out each option in the config with its own separate settings
    // (or return the first failure string describing which one is incorrect)
    for (let i = 0; i < allRawOptions.length; i += 1) {
        const rawOptions = allRawOptions[i];
        const projectPath = getProjectPath(cwd, filePath, rawOptions);
        const [compilerOptions, fileNames] = await Promise.all([
            parseRawCompilerOptions(projectPath),
            collectFileNames(argv, cwd, rawOptions),
        ]);

        const filledOutOptions = findComplaintForOptions(
            fillOutRawOptions({ argv, compilerOptions, cwd, fileNames, projectPath, rawOptions }),
        );
        if (typeof filledOutOptions === "string") {
            return `Invalid options at index ${i}: ${filledOutOptions}`;
        }

        results.push(filledOutOptions);
    }

    return results;
};

const getProjectPath = (cwd: string, filePath: string | undefined, rawOptions: RawTypeStatOptions): string => {
    // If the TypeStat configuration file has a projectPath field, use that relative to the file
    if (filePath !== undefined && rawOptions.projectPath !== undefined) {
        return normalizeAndSlashify(path.join(path.dirname(filePath), rawOptions.projectPath));
    }

    // Otherwise give up and try a ./tsconfig.json relative to the package directory
    return normalizeAndSlashify(path.join(cwd, "tsconfig.json"));
};

const collectFileNames = async (
    argv: TypeStatArgv,
    cwd: string,
    rawOptions: RawTypeStatOptions,
): Promise<ReadonlyArray<string> | undefined> => {
    if (argv.args !== undefined && argv.args.length !== 0) {
        return globAllAsync(argv.args);
    }

    if (rawOptions.include === undefined) {
        return undefined;
    }

    return globAllAsync(rawOptions.include.map((include) => path.join(cwd, include)));
};
