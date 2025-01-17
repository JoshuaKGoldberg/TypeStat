import * as fs from "node:fs/promises";

import { Fixes, RawTypeStatOptions } from "../../options/types.js";
import { isNotUndefined } from "../../shared/arrays.js";
import { ProjectDescription } from "../initializeProject/shared.js";
import { InitializationImprovement } from "./improvements.js";

export interface MultiTypeScriptConfigSettings {
	fileName: string;
	improvements: ReadonlySet<InitializationImprovement>;
	project: ProjectDescription;
	sourceFiles?: string;
	testFiles?: string;
}

export const writeMultiTypeScriptConfig = async (
	settings: MultiTypeScriptConfigSettings,
) => {
	const config = generateMultiTypeScriptConfig(settings);
	await fs.writeFile(settings.fileName, JSON.stringify(config, undefined, 4));
};

export const generateMultiTypeScriptConfig = ({
	improvements,
	project,
	sourceFiles,
	testFiles,
}: MultiTypeScriptConfigSettings) => {
	const fixes = printImprovements(improvements);

	const stage1: Partial<RawTypeStatOptions> = {
		fixes: {
			...fixes,
			strictNonNullAssertions: true,
		},
		include: testFiles ? [testFiles] : undefined,
		projectPath: project.filePath,
		types: {
			strictNullChecks: true,
		},
	};

	const stage2: Partial<RawTypeStatOptions> = {
		fixes,
		include: sourceFiles ? [sourceFiles] : undefined,
		projectPath: project.filePath,
	};

	const stage3Include = [testFiles, sourceFiles].filter(isNotUndefined);

	const stage3: Partial<RawTypeStatOptions> = {
		fixes,
		include: stage3Include.length ? stage3Include : undefined,
		projectPath: project.filePath,
	};

	return [stage1, stage2, stage3];
};

const printImprovements = (
	improvements: ReadonlySet<InitializationImprovement>,
): Partial<Fixes> => {
	const fixes: Partial<Fixes> = { incompleteTypes: true };
	if (improvements.has(InitializationImprovement.NoImplicitAny)) {
		fixes.noImplicitAny = true;
	}
	if (improvements.has(InitializationImprovement.NoInferableTypes)) {
		fixes.noInferableTypes = true;
	}
	if (improvements.has(InitializationImprovement.NoImplicitThis)) {
		fixes.noImplicitThis = true;
	}
	return fixes;
};
