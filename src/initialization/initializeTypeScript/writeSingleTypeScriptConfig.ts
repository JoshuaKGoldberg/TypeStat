import * as fs from "node:fs/promises";

import { ProjectDescription } from "../initializeProject/shared.js";
import { InitializationImprovement } from "./improvements.js";

export interface SingleTypeScriptConfigSettings {
	fileName: string;
	improvements: ReadonlySet<InitializationImprovement>;
	project: ProjectDescription;
	sourceFiles?: string;
}

export const writeSingleTypeScriptConfig = async ({
	fileName,
	improvements,
	project,
	sourceFiles,
}: SingleTypeScriptConfigSettings) => {
	await fs.writeFile(
		fileName,
		JSON.stringify(
			{
				fixes: printImprovements(improvements),
				...(sourceFiles && { include: [sourceFiles] }),
				projectPath: project.filePath,
			},
			undefined,
			4,
		),
	);
};

const printImprovements = (
	improvements: ReadonlySet<InitializationImprovement>,
) => {
	return {
		incompleteTypes: true,
		...(improvements.has(InitializationImprovement.NoImplicitAny) && {
			noImplicitAny: true,
		}),
		...(improvements.has(InitializationImprovement.NoImplicitThis) && {
			noImplicitThis: true,
		}),
	};
};
