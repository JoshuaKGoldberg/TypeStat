import * as path from "path";

import { RawTypeStatOptions } from "./types";

/**
 * Results from searching for a raw TypeStat configuration file.
 */
export interface FoundRawOptions {
    /**
     * Found file path result, if a file on disk was found.
     */
    filePath?: string;

    /**
     * Raw configuration options.
     */
    rawOptions: RawTypeStatOptions;
}

/**
 * Parses raw options from a configuration file.
 *
 * @param cwd   Base directory to resolve paths from.
 * @param configPath   Suggested path to load from, instead of searching.
 * @returns Promise for parsed raw options from a configuration file.
 */
export const findRawOptions = async (cwd: string, configPath: string): Promise<FoundRawOptions | string> => {
    const resolutionPath = path.join(cwd, configPath);

    let filePath: string;
    try {
        filePath = require.resolve(resolutionPath);
    } catch {
        return configPath === resolutionPath
            ? `Could not find config file at '${configPath}'.`
            : `Could not find config file at '${configPath}' (resolved to '${resolutionPath}').`;
    }

    const rawOptions = extractConfigAsRelative(filePath, require(filePath) as RawTypeStatOptions);

    return { filePath, rawOptions };
};

const extractConfigAsRelative = (filePath: string, config: RawTypeStatOptions): RawTypeStatOptions => {
    if (config.package !== undefined && config.package.directory !== undefined && !path.isAbsolute(config.package.directory)) {
        config = {
            ...config,
            package: {
                ...config.package,
                directory: path.join(filePath, config.package.directory),
            },
        };
    }

    return config;
};
