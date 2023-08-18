/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from "path";

import { RawTypeStatOptions } from "./types";

/**
 * Results from searching for a raw TypeStat configuration file.
 */
export interface FoundRawOptions {
    /**
     * Raw configuration options to run in order.
     */
    allRawOptions: RawTypeStatOptions[];

    /**
     * Found file path result, if a file on disk was found.
     */
    filePath?: string;
}

/**
 * Parses raw options from a configuration file.
 *
 * @param cwd   Base directory to resolve paths from.
 * @param configPath   Suggested path to load from, instead of searching.
 * @returns Parsed raw options from a configuration file, or an error string.
 */
export const findRawOptions = (cwd: string, configPath: string): FoundRawOptions | string => {
    const resolutionPath = path.join(cwd, configPath);

    let filePath: string;
    try {
        filePath = require.resolve(resolutionPath);
    } catch {
        return configPath === resolutionPath
            ? `Could not find config file at '${configPath}'.`
            : `Could not find config file at '${configPath}' (resolved to '${resolutionPath}').`;
    }

    const allRawOptions = extractConfigAsRelative(filePath, require(filePath) as RawTypeStatOptions | RawTypeStatOptions[]);

    return { filePath, allRawOptions };
};

const extractConfigAsRelative = (filePath: string, config: RawTypeStatOptions | RawTypeStatOptions[]): RawTypeStatOptions[] => {
    return config instanceof Array ? config.map((config) => relativizeConfig(filePath, config)) : [relativizeConfig(filePath, config)];
};

const relativizeConfig = (filePath: string, config: RawTypeStatOptions) => {
    if (config.package?.directory !== undefined && !path.isAbsolute(config.package.directory)) {
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
