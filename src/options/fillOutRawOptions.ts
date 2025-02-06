import ts from "typescript";

import { ProcessOutput } from "../output/types.js";
import { collectOptionals } from "../shared/arrays.js";
import { ReactPropTypesHint, ReactPropTypesOptionality } from "./enums.js";
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
	parsedTsConfig: Readonly<ts.ParsedCommandLine>;
	projectPath: string;
	rawOptions: RawTypeStatOptions;
}

/**
 * Combines Node and CLi argument options with project and file metadata into pending TypeStat options.
 * @returns Parsed TypeStat options, or a string for an error complaint.
 */
export const fillOutRawOptions = ({
	cwd,
	output,
	parsedTsConfig,
	projectPath,
	rawOptions,
}: OptionsFromRawOptionsSettings): PendingTypeStatOptions => {
	const rawOptionTypes = rawOptions.types ?? {};
	const noImplicitAny = collectNoImplicitAny(
		parsedTsConfig.options,
		rawOptions,
	);
	const noImplicitThis = collectNoImplicitThis(
		parsedTsConfig.options,
		rawOptions,
	);
	const { compilerStrictNullChecks, typeStrictNullChecks } =
		collectStrictNullChecks(parsedTsConfig.options, rawOptionTypes);

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
		include: rawOptions.include?.length
			? rawOptions.include
			: parsedTsConfig.fileNames,
		mutators: collectAddedMutators(
			rawOptions,
			packageOptions.directory,
			output,
		),
		output,
		package: packageOptions,
		parsedTsConfig: {
			...parsedTsConfig,
			options: {
				...parsedTsConfig.options,
				noEmit: true,
				noImplicitAny,
				noImplicitThis,
				strictNullChecks: compilerStrictNullChecks,
			},
		},
		postProcess: { shell },
		projectPath,
		types: {
			strictNullChecks: typeStrictNullChecks,
		},
	};
};
