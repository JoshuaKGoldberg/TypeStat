import ts from "typescript";

import { ProcessOutput } from "../output/types.js";
import { FileMutator } from "../shared/fileMutator.js";
import { ReactPropTypesHint, ReactPropTypesOptionality } from "./enums.js";

/**
 * Options listed as JSON in a typestat configuration file.
 * These are read from disk and parsed into {@link PendingTypeStatOptions}.
 */
export interface RawTypeStatOptions {
	/**
	 * Which post-run cleanups are enabled.
	 */
	readonly cleanups?: Partial<Cleanups>;

	/**
	 * Directives for file-level changes.
	 */
	readonly files?: Readonly<Partial<Files>>;

	/**
	 * Any tsquery filters to exclude within files.
	 */
	readonly filters?: readonly string[];

	/**
	 * Which fixes (type mutations) are enabled.
	 */
	readonly fixes?: Partial<Fixes>;

	/**
	 * Behavior requests around how to infer types.
	 */
	readonly hints?: Partial<RuntimeHints>;

	/**
	 * Globs of files to run on, if not everything in the TypeScript project.
	 */
	readonly include?: readonly string[];

	/**
	 * Any user-defined mutators to apply after the built-in mutators.
	 */
	readonly mutators?: readonly string[];

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
	 * Whether each post-run cleanup is enabled.
	 */
	readonly cleanups: Readonly<Cleanups>;

	/**
	 * Parsed TypeScript compiler options with relevant fields filled out.
	 */
	readonly parsedTsConfig: Readonly<ts.ParsedCommandLine>;

	/**
	 * Directives for file-level changes.
	 */
	readonly files: Readonly<Files>;

	/**
	 * Any tsquery filters to exclude within files.
	 */
	readonly filters?: readonly string[];

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
	readonly mutators: readonly [string, FileMutator][];

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
 * These have includes globbed from disks to turn into {@link TypeStatOptions}.
 */
export interface PendingTypeStatOptions extends BaseTypeStatOptions {
	/**
	 * Globs of files to run on, if not everything in the TypeScript project.
	 */
	readonly include?: readonly string[];
}

/**
 * Parsed runtime options for TypeStat after file renames and loading files are done.
 */
export interface TypeStatOptions extends BaseTypeStatOptions {
	/**
	 * File names to run on, as globbed by the include globs.
	 */
	readonly fileNames: readonly string[];
}

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
export type RenameExtensions = "ts" | "tsx" | boolean;

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
	missingTypes: "npm" | "yarn" | true | undefined;
}

/**
 * Hooks to run after mutations are complete.
 */
export interface PostProcess {
	/**
	 * Shell commands to execute in order after mutations on mutated file paths.
	 */
	shell: readonly (readonly string[])[];
}

/**
 * Cleanups to run after fixing is done.
 */
export interface Cleanups {
	/**
	 * Whether to suppress TypeScript type errors with comment directives.
	 */
	suppressTypeErrors: boolean;
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
