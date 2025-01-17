import * as fs from "node:fs/promises";

import { Fixes, RawTypeStatOptions } from "../../options/types.js";
import { ProjectDescription } from "../initializeProject/shared.js";
import { InitializationImprovement } from "./improvements.js";

export interface SingleTypeScriptConfigSettings {
	fileName: string;
	improvements: ReadonlySet<InitializationImprovement>;
	project: ProjectDescription;
	sourceFiles?: string;
}

export const writeSingleTypeScriptConfig = async (
	settings: SingleTypeScriptConfigSettings,
) => {
	const config = generateSingleTypeScriptConfig(settings);
	await fs.writeFile(settings.fileName, JSON.stringify(config, undefined, 4));
};

export const generateSingleTypeScriptConfig = ({
	improvements,
	project,
	sourceFiles,
}: SingleTypeScriptConfigSettings) => {
	const config: Partial<RawTypeStatOptions> = {
		fixes: printImprovements(improvements),
		include: sourceFiles ? [sourceFiles] : undefined,
		projectPath: project.filePath,
	};
	return config;
};

const printImprovements = (
	improvements: ReadonlySet<InitializationImprovement>,
): Partial<Fixes> => {
	const fixes: Partial<Fixes> = { incompleteTypes: true };
	if (improvements.has(InitializationImprovement.NoImplicitAny)) {
		fixes.noImplicitAny = true;
	}
	if (improvements.has(InitializationImprovement.NoImplicitThis)) {
		fixes.noImplicitThis = true;
	}
	return fixes;
};
