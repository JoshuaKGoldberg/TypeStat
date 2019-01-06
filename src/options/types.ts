import * as ts from "typescript";

import { ProcessLogger } from "../logging/logger";
import { FileMutator } from "../mutators/fileMutator";
import { Dictionary } from "../shared/maps";

/**
 * Options listed as JSON in a typestat configuration file.
 *
 * @remarks These are read by Cosmiconfig and parsed into {@link TypeStatOptions}.
 */
export interface RawTypeStatOptions {
    /**
     * Directives for file-level changes.
     */
    readonly files?: Readonly<Partial<Files>>;

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

    /**
     * Whether to add `null` and `undefined` as per TypeScript's --strictNullChecks.
     */
    strictNullChecks?: boolean;
}

/**
 * Parsed runtime options for TypeStat.
 */
export interface TypeStatOptions {
    /**
     * Parsed TypeScript compiler options with relevant fields filled out.
     */
    readonly compilerOptions: Readonly<TypeStatCompilerOptions>;

    /**
     * File names to run, if not everything in the TypeScript project.
     */
    readonly fileNames?: ReadonlyArray<string>;

    /**
     * Directives for file-level changes.
     */
    readonly files: Readonly<Files>;

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
    readonly logger: ProcessLogger;

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
 * Parsed TypeScript compiler options with relevant fields filled out.
 */
export type TypeStatCompilerOptions = ts.CompilerOptions & {
    noImplicitAny: boolean;
    strictNullChecks: boolean;
};

/**
 * Directives for file-level changes.
 */
export interface Files {
    /**
     * Comment to add above modified files, if any.
     */
    above: string;

    /**
     * Comment to add below modified files, if any.
     */
    below: string;

    /**
     * Whether to convert .js(x) files to .ts(x).
     */
    renameExtensions: boolean;
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
     * Whether to fill in missing properties per TypeScript's code fixes.
     */
    missingProperties: boolean;

    /**
     * Whether to add type annotations to types that don't yet have them per TypeScript's --noImplicitAny.
     */
    noImplicitAny: boolean;

    /**
     * Whether to consider `this` type annotations to functions that don't yet have them per TypeScript's --noImplicitThis.
     */
    noImplicitThis: boolean;

    /**
     * Whether to add missing non-null assertions in nullable property accesses, function-like calls, and return types.
     */
    strictNonNullAssertions: boolean;
}

/**
 * Options for which types to add under what aliases.
 */
export interface TypeStatTypeOptions {
    /**
     * Names of added type matchers mapped to strings to replace them with.
     */
    aliases: ReadonlyMap<RegExp, string>;

    /**
     * Glob matchers added types must match, if provided.
     */
    matching?: ReadonlyArray<string>;

    /**
     * Whether to exclude complex types from changes, such as arrays or interfaces.
     */
    onlyPrimitives?: boolean;

    /**
     * Whether to consider `null` and `undefined` as per TypeScript's --strictNullChecks.
     */
    strictNullChecks?: boolean;
}
