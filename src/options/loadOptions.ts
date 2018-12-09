// tslint:disable-next-line:no-require-imports
import cosmiconfig = require("cosmiconfig");

import { globAllAsync } from "../shared/glob";
import { fillOutRawOptions } from "./fillOutRawOptions";
import { RawTypeStatOptions, TypeStatOptions } from "./types";

/**
 * Parses raw options from a configuration file, using Cosmiconfig to find it if necessary.
 * 
 * @param configPath   Suggested path to load from, instead of searching.
 * @returns Promise for parsed raw options from a configuration file.
 * @remarks This defaults to 
 */
const findRawOptions = async (configPath?: string): Promise<RawTypeStatOptions> => {
    const explorer = cosmiconfig("typestat");
    const cosmiconfigResult = configPath === undefined ? await explorer.search() : await explorer.load(configPath);

    return cosmiconfigResult === null
        ? {
            projectPath: "tsconfig.json",
        }
        : cosmiconfigResult.config as RawTypeStatOptions;
};

/**
 * Reads TypeStat options using Cosmiconfig or a config path.
 *
 * @param configPath   Manual path to a config file to use intsead of a Cosmiconfig lookup.
 * @returns Promise for filled-out TypeStat options.
 */
export const loadOptions = async (configPath?: string): Promise<TypeStatOptions> => {
    const rawOptions = await findRawOptions(configPath);
    const fileNames = rawOptions.include === undefined ? undefined : await globAllAsync(rawOptions.include);

    return fillOutRawOptions(rawOptions, fileNames);
};
