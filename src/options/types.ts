import * as ts from "typescript";

import { ProcessOutput } from "../output";
import { FileMutator } from "../mutators/fileMutator";
import { ReactPropTypesHint, ReactPropTypesOptionality } from "./enums";

/**
 * Options listed as JSON in a typestat configuration file.
 *
 * @remarks These are read from disk and parsed into {@link TypeStatOptions}.
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
     * Behavior requests around how to infer types.
     */
    readonly hints?: Partial<RuntimeHints>;

    /**
     * Globs of files to run on, if not everything in the TypeScript project.
     */
    readonly include?: ReadonlyArray<string>;

    /**
     * Any user-defined mutators to apply after the built-in mutators.
     */
    readonly mutators?: ReadonlyArray<string>;

    /**
     * Directives for project-level changes.
     */
    readonly package?: Readonly<Partial<Package>>;

    /**
     * Hooks to run after mutations are complete.
     */
    readonly postProcess?: Readonly<Partial<PostProcess>>;

    /**
     * Path to a TypeScript configuration file, if not "tsconfig.json".
     */
    readonly projectPath?: string;

    /**
     * Options for which types to add under what aliases.
     */
    readonly types?: RawTypeStatTypeOptions;
}

/**
 * Options for which types to add under what aliases.
 */
export interface RawTypeStatTypeOptions {
    /**
     * Whether to add `null` and `undefined` as per TypeScript's --strictNullChecks.
     */
    strictNullChecks?: boolean;
}

/**
 * Common parsed runtime options for TypeStat.
 */
export interface BaseTypeStatOptions {
    /**
     * Parsed TypeScript compiler options with relevant fields filled out.
     */
    readonly compilerOptions: Readonly<TypeStatCompilerOptions>;

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
     * Behavior requests around how to infer types.
     */
    readonly hints: RuntimeHints;

    /**
     * Mutators to run, as either the built-in mutators or custom mutators specified by the user.
     */
    readonly mutators: ReadonlyArray<[string, FileMutator]>;

    /**
     * Wraps process and logfile output.
     */
    readonly output: ProcessOutput;

    /**
     * Directives for project-level changes.
     */
    readonly package: Readonly<Package>;

    /**
     * Hooks to run after mutations are complete.
     */
    readonly postProcess: Readonly<PostProcess>;

    /**
     * Path to a tsconfig.json file.
     */
    readonly projectPath: string;

    /**
     * Options for which types to add under what aliases.
     */
    readonly types: TypeStatTypeOptions;
}

/**
 * Parsed runtime options for TypeStat after file renames and before loading files.
 */
export interface PendingTypeStatOptions extends BaseTypeStatOptions {
    /**
     * Globs of files to run on, if not everything in the TypeScript project.
     */
    readonly include?: ReadonlyArray<string>;
}

/**
 * Parsed runtime options for TypeStat after file renames and loading files are done.
 */
export interface TypeStatOptions extends BaseTypeStatOptions {
    /**
     * File names to run, if not everything in the TypeScript project.
     */
    readonly fileNames?: ReadonlyArray<string>;
}

/**
 * Parsed TypeScript compiler options with relevant fields filled out.
 */
export type TypeStatCompilerOptions = ts.CompilerOptions & {
    noImplicitAny: boolean;
    noImplicitThis: boolean;
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
    renameExtensions: RenameExtensions;
}

/**
 * Setting value for whether to convert .js(x) files to .ts(x).
 */
export type RenameExtensions = boolean | "ts" | "tsx";

/**
 * Cross-file settings for forms of fixes.
 */
export interface Fixes {
    /**
     * Whether to add extensions to export and import declarations that refer to file paths without them.
     */
    importExtensions: boolean;

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
     * Whether to add type annotations to functions that don't yet have them per TypeScript's --noImplicitThis.
     */
    noImplicitThis: boolean;

    /**
     * Whether to remove type annotations that don't change the meaning of code.
     */
    noInferableTypes: boolean;

    /**
     * Whether to add missing non-null assertions in nullable property accesses, function-like calls, and return types.
     */
    strictNonNullAssertions: boolean;
}

/**
 * Behavior requests around how to infer types.
 */
export interface RuntimeHints {
    /**
     * Behavior requests around how to infer React types.
     */
    react: RuntimeReactHints;
}

/**
 * Behavior requests around how to infer React types.
 */
export interface RuntimeReactHints {
    /**
     * Whether and how to use components' propTypes for inferences.
     */
    propTypes: ReactPropTypesHint;

    /**
     * Whether to make propType inferences optional and/or required.
     */
    propTypesOptionality: ReactPropTypesOptionality;
}

/**
 * Directives for package-level changes.
 */
export interface Package {
    /**
     * Working directory to base paths off of.
     */
    directory: string;

    /**
     * Path to a package.json to consider the project's package.
     */
    file: string;

    /**
     * Package manager to install missing types, if not `true` to auto-detect or `undefined` to not.
     */
    missingTypes: true | "npm" | "yarn" | undefined;
}

/**
 * Hooks to run after mutations are complete.
 */
export interface PostProcess {
    /**
     * Shell commands to execute in order after mutations on mutated file paths.
     */
    shell: ReadonlyArray<ReadonlyArray<string>>;
}

/**
 * Options for which types to add under what aliases.
 */
export interface TypeStatTypeOptions {
    /**
     * Whether to consider `null` and `undefined` as per TypeScript's --strictNullChecks.
     */
    strictNullChecks?: boolean;
}
