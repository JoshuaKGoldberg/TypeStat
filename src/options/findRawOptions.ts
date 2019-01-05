import * as path from "path";

// tslint:disable-next-line:no-require-imports
import cosmiconfig = require("cosmiconfig");

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
 * @param configPath   Suggested path to load from, instead of searching.
 * @returns Promise for parsed raw options from a configuration file.
 * @remarks This defaults to tsconfig.json in the local directory.
 */
export const findRawOptions = async (configPath?: string): Promise<FoundRawOptions> => {
    const explorer = cosmiconfig("typestat");
    const cosmiconfigResult = configPath === undefined ? await explorer.search() : await explorer.load(configPath);

    return cosmiconfigResult === null
        ? {
              rawOptions: {
                  projectPath: normalizeAndSlashify(path.join(process.cwd(), "tsconfig.json")),
              },
          }
        : {
              filePath: cosmiconfigResult.filepath,
              rawOptions: cosmiconfigResult.config as RawTypeStatOptions,
          };
};
