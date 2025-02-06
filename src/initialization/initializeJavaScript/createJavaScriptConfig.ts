import { RawTypeStatOptions, RenameExtensions } from "../../options/types.js";
import { ProjectDescription } from "../initializeProject/shared.js";
import { InitializationCleanups } from "./cleanups.js";
import { InitializationImports } from "./imports.js";
import { InitializationRenames } from "./renames.js";

export interface JavaScriptConfigSettings {
	cleanups: InitializationCleanups;
	imports: InitializationImports;
	project: ProjectDescription;
	renames: InitializationRenames;
	sourceFiles?: string;
}

export const createJavaScriptConfig = ({
	cleanups,
	imports,
	project,
	renames,
	sourceFiles,
}: JavaScriptConfigSettings): RawTypeStatOptions | RawTypeStatOptions[] => {
	const fileConversion: RawTypeStatOptions = {
		files: {
			renameExtensions: printRenames(renames),
		},
	};

	const coreCleanups: RawTypeStatOptions =
		cleanups === InitializationCleanups.Yes
			? { cleanups: { suppressTypeErrors: true } }
			: {};

	const coreConversion: RawTypeStatOptions = {
		fixes: {
			incompleteTypes: true,
			missingProperties: true,
			noImplicitAny: true,
		},
		...coreCleanups,
	};

	const included = (include: string[] | undefined): RawTypeStatOptions =>
		include?.length ? { include } : {};

	const sourceFilesInclude: RawTypeStatOptions = included(
		sourceFiles ? [sourceFiles] : undefined,
	);

	if (imports === InitializationImports.Yes) {
		return [
			{
				...fileConversion,
				fixes: {
					importExtensions: true,
				},
				...sourceFilesInclude,
				projectPath: project.filePath,
			},
			{
				...coreConversion,
				...included(getRenamedSourceFiles(sourceFiles, renames)),
				projectPath: project.filePath,
			},
		];
	}

	return {
		...fileConversion,
		...coreConversion,
		...sourceFilesInclude,
		projectPath: project.filePath,
	};
};

const printRenames = (renames: InitializationRenames): RenameExtensions => {
	switch (renames) {
		case InitializationRenames.Auto:
			return true;

		case InitializationRenames.TS:
			return "ts";

		case InitializationRenames.TSX:
			return "tsx";
	}
};

function getRenamedSourceFiles(
	sourceFiles: string | undefined,
	renames: InitializationRenames,
): string[] | undefined {
	return sourceFiles
		? renames === InitializationRenames.Auto
			? renameSourceFilesExtensionsAuto(sourceFiles)
			: renames === InitializationRenames.TS
				? renameSourceFilesExtensions(sourceFiles, "ts")
				: renameSourceFilesExtensions(sourceFiles, "tsx")
		: undefined;
}

function renameSourceFilesExtensions(
	sourceFiles: string,
	extension: string,
): string[] {
	return [
		sourceFiles
			.replace(/(\.|\{)js/, `$1${extension}`)
			.replace(new RegExp(`{${extension},jsx?}`), extension),
	];
}

function renameSourceFilesExtensionsAuto(sourceFiles: string): string[] {
	for (const [original, replacement] of [
		[/\{js,jsx\}/, "{ts,tsx}"],
		[/\.js$/, ".{ts,tsx}"],
	] as const) {
		sourceFiles = sourceFiles.replace(original, replacement);
	}

	return renameSourceFilesExtensions(sourceFiles, "ts");
}
