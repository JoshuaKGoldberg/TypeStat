import * as path from "path";

// tslint:disable-next-line:no-require-imports
import cosmiconfig = require("cosmiconfig");

import { ParsedCliArgv } from "../cli";
import { globAllAsync } from "../shared/glob";
import { normalizeAndSlashify } from "../shared/paths";
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
            projectPath: normalizeAndSlashify(path.join(process.cwd(), "tsconfig.json")),
        }
        : cosmiconfigResult.config as RawTypeStatOptions;
};

/**
 * Reads TypeStat options using Cosmiconfig or a config path.
 *
 * @param configPath   Manual path to a config file to use intsead of a Cosmiconfig lookup.
 * @returns Promise for filled-out TypeStat options.
 */
export const loadOptions = async (argv: ParsedCliArgv): Promise<TypeStatOptions | undefined> => {
    const rawOptions = await findRawOptions(argv.config);
    const fileNames = await collectFileNames(argv, rawOptions); 
    const options = await fillOutRawOptions(argv, rawOptions, fileNames);

    return noFixesSpecified(options)
        ? undefined
        : options;
};

const collectFileNames = async (argv: ParsedCliArgv, rawOptions: RawTypeStatOptions): Promise<ReadonlyArray<string> | undefined> => {
    if (argv.args !== undefined && argv.args.length !== 0) {
        return globAllAsync(argv.args);
    }

    if (rawOptions.include === undefined) {
        return undefined;
    }

    return globAllAsync(rawOptions.include);
};

const noFixesSpecified = (options: TypeStatOptions): boolean =>
    !options.fixes.incompleteTypes 
    && !options.fixes.noImplicitAny 
    && !options.fixes.noImplicitThis;
