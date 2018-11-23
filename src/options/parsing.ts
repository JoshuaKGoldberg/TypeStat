// tslint:disable-next-line:no-require-imports
import cosmiconfig = require("cosmiconfig");

import { globAllAsync } from "../shared/glob";
import { convertObjectToMap } from "../shared/maps";
import { RawTypeUpOptions, TypeUpOptions } from "./types";

const findRawOptions = async (configPath?: string): Promise<RawTypeUpOptions> => {
    const explorer = cosmiconfig("typeup");
    const cosmiconfigResult = configPath === undefined ? await explorer.search() : await explorer.load(configPath);

    return cosmiconfigResult === null
        ? {
            projectPath: "typeup.json",
        }
        : cosmiconfigResult.config as RawTypeUpOptions;
};

export const fillOutRawOptions = (rawOptions: RawTypeUpOptions, fileNames?: ReadonlyArray<string>): TypeUpOptions => {
    return {
        fileNames,
        projectPath: rawOptions.projectPath === undefined
            ? "tsconfig.json"
            : rawOptions.projectPath,
        typeAliases: rawOptions.typeAliases === undefined
            ? new Map()
            : convertObjectToMap(rawOptions.typeAliases),
    };
};

/**
 * Reads TypeUp options using Cosmiconfig or a config path.
 *
 * @param configPath   Manual path to a config file to use intsead of a Cosmiconfig lookup.
 * @returns Promise for filled-out TypeUp options.
 */
export const loadOptions = async (configPath?: string): Promise<TypeUpOptions> => {
    const rawOptions = await findRawOptions(configPath);
    const fileNames = rawOptions.include === undefined ? undefined : await globAllAsync(rawOptions.include);

    return fillOutRawOptions(rawOptions, fileNames);
};
