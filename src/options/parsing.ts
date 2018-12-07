// tslint:disable-next-line:no-require-imports
import cosmiconfig = require("cosmiconfig");

import { processLogger } from "../logging/logger";
import { globAllAsync } from "../shared/glob";
import { convertObjectToMap } from "../shared/maps";
import { RawTypeStatOptions, TypeStatOptions } from "./types";

const findRawOptions = async (configPath?: string): Promise<RawTypeStatOptions> => {
    const explorer = cosmiconfig("typestat");
    const cosmiconfigResult = configPath === undefined ? await explorer.search() : await explorer.load(configPath);

    return cosmiconfigResult === null
        ? {
            projectPath: "typestat.json",
        }
        : cosmiconfigResult.config as RawTypeStatOptions;
};

export const fillOutRawOptions = (rawOptions: RawTypeStatOptions, fileNames?: ReadonlyArray<string>): TypeStatOptions => {
    return {
        fileNames,
        fixes: {
            noImplicitAny: true,
            strictNullChecks: true,
            ...rawOptions.fixes,
        },
        logger: processLogger,
        projectPath: rawOptions.projectPath === undefined
            ? "tsconfig.json"
            : rawOptions.projectPath,
        typeAliases: rawOptions.typeAliases === undefined
            ? new Map()
            : convertObjectToMap(rawOptions.typeAliases),
    };
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
