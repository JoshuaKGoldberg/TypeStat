// tslint:disable-next-line:no-require-imports
import cosmiconfig = require("cosmiconfig");
import { globAllAsync } from "./shared/glob";

/**
 * Options listed as JSON in a typeup configuration file.
 *
 * @remarks These are read by Cosmiconfig and parsed by {@link loadOptions} to {@link TypeUpOptions}.
 */
export interface RawTypeUpOptions {
    /**
     * Any settings overrides for fixers.
     */
    readonly fixes?: RawFixOptions;

    /**
     * Globs of files to run on, if not everything in the TypeScript project.
     */
    readonly include?: ReadonlyArray<string>;

    /**
     * Path to a TypeScript configuration file, if not "tsconfig.json".
     */
    readonly projectPath?: string;
}

/**
 * Any settings overrides for fixers.
 */
export interface RawFixOptions {
    readonly "parameter-strictness"?: FixOption;
    readonly "property-strictness"?: FixOption;
    readonly "return-strictness"?: FixOption;
    readonly "variable-strictness"?: FixOption;
}

/**
 * Either `false` to disable a fix or a custom comment marker.
 */
export type FixOption =
    | false
    | {
          readonly comment: false | string;
      };

/**
 * Parsed runtime options to run TypeUp.
 */
export interface TypeUpOptions {
    /**
     * File names to run, if not everything in the TypeScript project.
     */
    readonly fileNames?: ReadonlyArray<string>;

    /**
     * Filed-out options for fixers.
     */
    readonly fixes: FixOptions;

    /**
     * Path to a tsconfig.json file.
     */
    readonly projectPath: string;
}

export interface FixOptions {
    readonly parameterStrictness: FixOption;
    readonly propertyStrictness: FixOption;
    readonly returnStrictness: FixOption;
    readonly variableStrictness: FixOption;
}

const defaultFixOptions: FixOptions = {
    parameterStrictness: {
        comment: "parameter-strictness",
    },
    propertyStrictness: {
        comment: "property-strictness",
    },
    returnStrictness: {
        comment: "return-strictness",
    },
    variableStrictness: {
        comment: "variable-strictness",
    },
};

const fillOutDefaultOptions = (rawOptions: Partial<TypeUpOptions>): TypeUpOptions => ({
    fileNames: rawOptions.fileNames,
    fixes:
        rawOptions.fixes === undefined
            ? defaultFixOptions
            : {
                  ...defaultFixOptions,
                  ...rawOptions.fixes,
              },
    projectPath: "tsconfig.json",
    ...rawOptions,
});

const fillOutDefaultFix = (fixes: RawFixOptions, comment: keyof RawFixOptions): FixOption => {
    return fixes[comment] === undefined ? { comment } : (fixes[comment] as FixOption);
};

/**
 * Converts raw options to filled-out options.
 * 
 * @param rawOptions   Raw options from a config file.
 * @param fileNames   File names to use, if not everything from the TypeScript project.
 */
export const convertRawTypeUpOptions = (rawOptions: RawTypeUpOptions, fileNames: ReadonlyArray<string> | undefined): TypeUpOptions => {
    const fixes = rawOptions.fixes === undefined ? {} : rawOptions.fixes;

    return fillOutDefaultOptions({
        fileNames,
        fixes: {
            parameterStrictness: fillOutDefaultFix(fixes, "parameter-strictness"),
            propertyStrictness: fillOutDefaultFix(fixes, "property-strictness"),
            returnStrictness: fillOutDefaultFix(fixes, "return-strictness"),
            variableStrictness: fillOutDefaultFix(fixes, "variable-strictness"),
        },
        projectPath: rawOptions.projectPath,
    });
};

/**
 * Reads TypeUp options using Cosmiconfig or a config path.
 * 
 * @param configPath   Manual path to a config file to use intsead of a Cosmiconfig lookup.
 * @returns Promise for filled-out TypeUp options.
 */
export const loadOptions = async (configPath?: string): Promise<TypeUpOptions> => {
    const explorer = cosmiconfig("typeup");
    const result = configPath === undefined ? await explorer.search() : await explorer.load(configPath);

    if (result === null) {
        throw new Error("Could not find TypeUp configuration.");
    }

    const rawOptions = result.config as RawTypeUpOptions;
    const fileNames = rawOptions.include === undefined ? undefined : await globAllAsync(rawOptions.include);

    return convertRawTypeUpOptions(rawOptions, fileNames);
};
