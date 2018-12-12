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
     * Any directories of user-defined fixers to apply after the built-in fixers.
     */
    readonly addedMutators?: ReadonlyArray<string>;

    /**
     * Which fixes (type mutations) are enabled, with fields defaulting to `true`.
     */
    readonly fixes?: Partial<Fixes>;

    /**
     * Globs of files to run on, if not everything in the TypeScript project.
     */
    readonly include?: ReadonlyArray<string>;

    /**
     * Whether to skip adding types that aren't `null` or `undefined`.
     */
    readonly onlyStrictNullTypes?: boolean;

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
 * Parsed runtime options for TypeStat.
 */
export interface TypeStatOptions {
    /**
     * Added fixers specified by the user.
     */
    readonly addedFixes: ReadonlyArray<[string, FileMutator]>;

    /**
     * File names to run, if not everything in the TypeScript project.
     */
    readonly fileNames?: ReadonlyArray<string>;

    /**
     * Whether each fix (type mutation) is enabled.
     */
    readonly fixes: Readonly<Fixes>;

    /**
     * Wraps process.stdout.write.
     */
    readonly logger: Logger;

    /**
     * Names of added types mapped to strings to replace them with.
     */
    readonly typeAliases: ReadonlyMap<string, string>;

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
