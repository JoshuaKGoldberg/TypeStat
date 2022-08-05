import * as path from "path";

import { TypeStatArgv } from "../index";
import { ProcessOutput } from "../output/types";
import { normalizeAndSlashify } from "../shared/paths";

import { fillOutRawOptions } from "./fillOutRawOptions";
import { findRawOptions } from "./findRawOptions";
import { findComplaintForOptions } from "./optionVerification";
import { parseRawCompilerOptions } from "./parseRawCompilerOptions";
import { PendingTypeStatOptions, RawTypeStatOptions } from "./types";

/**
 * Reads pre-file-rename TypeStat options using a config path.
 *
 * @param argv   Root arguments passed to TypeStat.
 * @param output   Wraps process and logfile output.
 * @returns Promise for filled-out TypeStat options, or a string complaint from failing to make them.
 */
export const loadPendingOptions = async (argv: TypeStatArgv, output: ProcessOutput): Promise<PendingTypeStatOptions[] | string> => {
    if (argv.config === undefined) {
        return "-c/--config file must be provided.";
    }

    const cwd = process.cwd();
    const foundRawOptions = await findRawOptions(cwd, argv.config);
    if (typeof foundRawOptions === "string") {
        return foundRawOptions;
    }

    const { allRawOptions, filePath } = foundRawOptions;
    const results: PendingTypeStatOptions[] = [];

    // Fill out each option in the config with its own separate settings
    // (or return the first failure string describing which one is incorrect)
    for (let i = 0; i < allRawOptions.length; i += 1) {
        const rawOptions = allRawOptions[i];
        const projectPath = getProjectPath(cwd, filePath, rawOptions);
        const compilerOptions = await parseRawCompilerOptions(cwd, projectPath);

        const filledOutOptions = fillOutRawOptions({ argv, compilerOptions, cwd, output, projectPath, rawOptions });
        const complaint = findComplaintForOptions(filledOutOptions);
        if (complaint) {
            return `Invalid options at index ${i}: ${complaint}`;
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
