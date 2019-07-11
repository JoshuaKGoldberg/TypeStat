// The version of cosmiconfig used when this disable was added did not support default exports
// `import =` is not supported by babel-typescript
// ...if either of those no longer hold true, please do change back to `import cosmiconfig from "cosmiconfig"`...
/* tslint:disable no-any no-unsafe-any no-require-imports no-var-requires */

const cosmiconfig = require("cosmiconfig");
import * as path from "path";

import { normalizeAndSlashify } from "../shared/paths";

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
 * Parses raw options from a configuration file, using Cosmiconfig to find it if necessary.
 *
 * @param packageDirectory   Base directory to resolve paths from.
 * @param configPath   Suggested path to load from, instead of searching.
 * @returns Promise for parsed raw options from a configuration file.
 * @remarks This defaults to tsconfig.json in the local directory.
 */
export const findRawOptions = async (packageDirectory: string, configPath?: string): Promise<FoundRawOptions> => {
    const explorer = cosmiconfig("typestat");
    const cosmiconfigResult = configPath === undefined ? await explorer.search() : await explorer.load(configPath);

    return cosmiconfigResult === null
        ? {
              rawOptions: {
                  projectPath: normalizeAndSlashify(path.join(packageDirectory, "tsconfig.json")),
              },
          }
        : {
              filePath: cosmiconfigResult.filepath,
              rawOptions: extractConfigAsRelative(cosmiconfigResult),
          };
};

const extractConfigAsRelative = (cosmiconfigResult: any): RawTypeStatOptions => {
    let config = cosmiconfigResult.config as RawTypeStatOptions;

    if (config.package !== undefined && config.package.directory !== undefined && !path.isAbsolute(config.package.directory)) {
        config = {
            ...config,
            package: {
                ...config.package,
                directory: path.join(cosmiconfigResult.filepath, config.package.directory),
            },
        };
    }

    return config;
};
