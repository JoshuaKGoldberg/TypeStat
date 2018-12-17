import { Logger } from "../logging/logger";
import { FileMutator } from "../mutators/fileMutator";
import { Dictionary } from "../shared/maps";

/**
 * Options listed as JSON in a typestat configuration file.
 *
 * @remarks These are read by Cosmiconfig and parsed into {@link TypeStatOptions}.
 */
export interface RawTypeStatOptions {
    /**
     * Any tsquery filters to exclude within files.
     */
    readonly filters?: ReadonlyArray<string>;

    /**
     * Which fixes (type mutations) are enabled, with fields defaulting to `true`.
     */
    readonly fixes?: Partial<Fixes>;

    /**
     * Globs of files to run on, if not everything in the TypeScript project.
     */
    readonly include?: ReadonlyArray<string>;

    /**
     * Any user-defined mutators to apply after the built-in mutators.
     */
    readonly mutators?: ReadonlyArray<string>;

    /**
     * Whether to skip adding types that aren't `null` or `undefined`.
     */
    readonly onlyStrictNullTypes?: boolean;

    /**
     * Options for which types to add under what aliases.
     */
    readonly types?: RawTypeStatTypeOptions;

    /**
     * Path to a TypeScript configuration file, if not "tsconfig.json".
     */
    readonly projectPath?: string;
}

/**
 * Options for which types to add under what aliases.
 */
export interface RawTypeStatTypeOptions {
    /**
     * Names of added types mapped to strings to replace them with.
     */
    aliases?: Readonly<Dictionary<string>>;

    /**
     * Regular expression matchers added types must match, if provided.
     */
    matching?: ReadonlyArray<string>;

    /**
     * Whether to exclude rich types from changes, such as arrays or interfaces.
     */
    onlyPrimitives?: boolean;
}

/**
 * Parsed runtime options for TypeStat.
 */
export interface TypeStatOptions {
    /**
     * File names to run, if not everything in the TypeScript project.
     */
    readonly fileNames?: ReadonlyArray<string>;

    /**
     * Any tsquery filters to exclude within files.
     */
    readonly filters?: ReadonlyArray<string>;

    /**
     * Whether each fix (type mutation) is enabled.
     */
    readonly fixes: Readonly<Fixes>;

    /**
     * Wraps process.stdout.write.
     */
    readonly logger: Logger;

    /**
     * Added mutators specified by the user.
     */
    readonly mutators: ReadonlyArray<[string, FileMutator]>;

    /**
     * Options for which types to add under what aliases.
     */
    readonly types: TypeStatTypeOptions;

    /**
     * Path to a tsconfig.json file.
     */
    readonly projectPath: string;
}

/**
 * Cross-file settings for forms of fixes.
 */
export interface Fixes {
    /**
     * Whether to augment existing type annotations that cause errors when different types are used.
     */
    incompleteTypes: boolean;

    /**
     * Whether to add type annotations to types that don't yet have them per TypeScript's --noImplicitAny.
     */
    noImplicitAny: boolean;

    /**
     * Whether to add `this` type annotations to functions that don't yet have them per TypeScript's --noImplicitThis.
     */
    noImplicitThis: boolean;

    /**
     * Whether to add `null` and `undefined` as per TypeScript's --strictNullChecks.
     */
    strictNullChecks: boolean;
}

/**
 * Options for which types to add under what aliases.
 */
export interface TypeStatTypeOptions {
    /**
     * Names of added types mapped to strings to replace them with.
     */
    aliases: ReadonlyMap<string, string>;

    /**
     * Glob matchers added types must match, if provided.
     */
    matching?: ReadonlyArray<string>;

    /**
     * Whether to exclude complex types from changes, such as arrays or interfaces.
     */
    onlyPrimitives?: boolean;
}
