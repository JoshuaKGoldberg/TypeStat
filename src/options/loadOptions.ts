import * as path from "path";

import { TypeStatArgv } from "../index";
import { globAllAsync } from "../shared/glob";
import { normalizeAndSlashify } from "../shared/paths";
import { fillOutRawOptions } from "./fillOutRawOptions";
import { findRawOptions, FoundRawOptions } from "./findRawOptions";
import { parseRawCompilerOptions } from "./parseRawCompilerOptions";
import { RawTypeStatOptions, TypeStatOptions } from "./types";

/**
 * Reads TypeStat options using Cosmiconfig or a config path.
 *
 * @param argv   Root arguments passed to TypeStat
 * @returns Promise for filled-out TypeStat options, or a string complaint from failing to make them.
 */
export const loadOptions = async (argv: TypeStatArgv): Promise<TypeStatOptions | string> => {
    const foundRawOptions = await findRawOptions(argv.config);
    const { rawOptions } = foundRawOptions;
    const projectPath = getProjectPath(argv, foundRawOptions);
    const [compilerOptions, fileNames] = await Promise.all([parseRawCompilerOptions(projectPath), collectFileNames(argv, rawOptions)]);

    return fillOutRawOptions({ argv, compilerOptions, fileNames, projectPath, rawOptions });
};

const getProjectPath = (argv: TypeStatArgv, foundOptions: FoundRawOptions): string => {
    // If a --project is provided by Node argv / the CLI, use that
    if (argv.project !== undefined) {
        return path.join(process.cwd(), argv.project);
    }

    // If the TypeStat configuration file has a projectPath field, use that relative to the file
    if (foundOptions.filePath !== undefined && foundOptions.rawOptions.projectPath !== undefined) {
        return normalizeAndSlashify(path.join(path.dirname(foundOptions.filePath), foundOptions.rawOptions.projectPath));
    }

    // Otherwise give up and try a ./tsconfig.json relative to the user's cwd
    return normalizeAndSlashify(path.join(process.cwd(), "tsconfig.json"));
};

const collectFileNames = async (argv: TypeStatArgv, rawOptions: RawTypeStatOptions): Promise<ReadonlyArray<string> | undefined> => {
    if (argv.args !== undefined && argv.args.length !== 0) {
        return globAllAsync(argv.args);
    }

    if (rawOptions.include === undefined) {
        return undefined;
    }

    return globAllAsync(rawOptions.include);
};
