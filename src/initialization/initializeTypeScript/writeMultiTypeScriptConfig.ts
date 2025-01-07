import * as fs from "node:fs/promises";

import { Fixes, RawTypeStatOptions } from "../../options/types.js";
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
		projectPath: project.filePath,
		types: {
			strictNullChecks: true,
		},
	};

	const stage2: Partial<RawTypeStatOptions> = {
		fixes,
		projectPath: project.filePath,
	};

	const stage3: Partial<RawTypeStatOptions> = {
		fixes,
		projectPath: project.filePath,
	};

	if (testFiles) {
		// @ts-expect-error Cannot assign to 'include' because it is a read-only property.
		stage1.include = [testFiles];
		// @ts-expect-error Property 'exclude' does not exist on type 'Partial<PendingTypeStatOptions>'.
		stage2.exclude = [testFiles];
		// @ts-expect-error Cannot assign to 'include' because it is a read-only property.
		stage3.include = [testFiles, sourceFiles].filter(Boolean);
	} else {
		// @ts-expect-error Cannot assign to 'include' because it is a read-only property.
		stage3.include = [sourceFiles].filter(Boolean);
	}

	if (sourceFiles) {
		// @ts-expect-error Cannot assign to 'include' because it is a read-only property.
		stage2.include = [sourceFiles];
	}

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
