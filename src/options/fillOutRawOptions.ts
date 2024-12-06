import { ProcessOutput } from "../output/types.js";
import { collectOptionals } from "../shared/arrays.js";
import { ReactPropTypesHint, ReactPropTypesOptionality } from "./enums.js";
import { ParsedTsConfig } from "./parseRawCompilerOptions.js";
import { collectAddedMutators } from "./parsing/collectAddedMutators.js";
import { collectFileOptions } from "./parsing/collectFileOptions.js";
import { collectNoImplicitAny } from "./parsing/collectNoImplicitAny.js";
import { collectNoImplicitThis } from "./parsing/collectNoImplicitThis.js";
import { collectPackageOptions } from "./parsing/collectPackageOptions.js";
import { collectStrictNullChecks } from "./parsing/collectStrictNullChecks.js";
import { PendingTypeStatOptions, RawTypeStatOptions } from "./types.js";

export interface OptionsFromRawOptionsSettings {
	cwd: string;
	output: ProcessOutput;
	projectPath: string;
	rawOptions: RawTypeStatOptions;
	tsConfig: Readonly<ParsedTsConfig>;
}

/**
 * Combines Node and CLi argument options with project and file metadata into pending TypeStat options.
 * @returns Parsed TypeStat options, or a string for an error complaint.
 */
export const fillOutRawOptions = ({
	cwd,
	output,
	projectPath,
	rawOptions,
	tsConfig,
}: OptionsFromRawOptionsSettings): PendingTypeStatOptions => {
	const rawOptionTypes = rawOptions.types ?? {};
	const compilerOptions = tsConfig.compilerOptions;
	const noImplicitAny = collectNoImplicitAny(compilerOptions, rawOptions);
	const noImplicitThis = collectNoImplicitThis(compilerOptions, rawOptions);
	const strictNullChecks = collectStrictNullChecks(
		compilerOptions,
		rawOptionTypes,
	);

	const packageOptions = collectPackageOptions(cwd, rawOptions);

	const shell: (readonly string[])[] = [];
	if (rawOptions.postProcess?.shell !== undefined) {
		shell.push(...rawOptions.postProcess.shell);
	}

	return {
		cleanups: {
			suppressTypeErrors: false,
			...rawOptions.cleanups,
		},
		compilerOptions: {
			...compilerOptions,
			noImplicitAny,
			noImplicitThis,
			strictNullChecks,
		},
		files: collectFileOptions(rawOptions),
		filters: collectOptionals(rawOptions.filters),
		fixes: {
			importExtensions: false,
			incompleteTypes: false,
			missingProperties: false,
			noImplicitAny: false,
			noImplicitThis: false,
			noInferableTypes: false,
			strictNonNullAssertions: false,
			...rawOptions.fixes,
		},
		hints: {
			react: {
				propTypes:
					rawOptions.hints?.react?.propTypes ?? ReactPropTypesHint.WhenRequired,
				propTypesOptionality:
					rawOptions.hints?.react?.propTypesOptionality ??
					ReactPropTypesOptionality.AsWritten,
			},
		},
		include: rawOptions.include ?? tsConfig.include,
		mutators: collectAddedMutators(
			rawOptions,
			packageOptions.directory,
			output,
		),
		output,
		package: packageOptions,
		postProcess: { shell },
		projectPath,
		types: {
			strictNullChecks,
		},
	};
};
