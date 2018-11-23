import { Dictionary } from "../shared/maps";

/**
 * Options listed as JSON in a typeup configuration file.
 *
 * @remarks These are read by Cosmiconfig and parsed into {@link TypeUpOptions}.
 */
export interface RawTypeUpOptions {
    /**
     * Globs of files to run on, if not everything in the TypeScript project.
     */
    readonly include?: ReadonlyArray<string>;

    /**
     * Names of added types mapped to strings to replace them with.
     */
    readonly typeAliases?: Readonly<Dictionary<string>>;

    /**
     * Path to a TypeScript configuration file, if not "tsconfig.json".
     */
    readonly projectPath?: string;
}

/**
 * Parsed runtime options to run TypeUp.
 */
export interface TypeUpOptions {
    /**
     * File names to run, if not everything in the TypeScript project.
     */
    readonly fileNames?: ReadonlyArray<string>;

    /**
     * Names of added types mapped to strings to replace them with.
     */
    readonly typeAliases: ReadonlyMap<string, string>;

    /**
     * Path to a tsconfig.json file.
     */
    readonly projectPath: string;
}
