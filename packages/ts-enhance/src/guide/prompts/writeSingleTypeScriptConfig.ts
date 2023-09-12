import * as fs from "node:fs/promises";

import { InitializationFix } from "./promptForFixes.js";

export interface SingleTypeScriptConfigSettings {
	fileName: string;
	fixes: ReadonlySet<InitializationFix>;
	projectPath: string;
	sourceFiles?: string;
}

export const writeSingleTypeScriptConfig = async ({
	fileName,
	fixes,
	projectPath,
	sourceFiles,
}: SingleTypeScriptConfigSettings) => {
	await fs.writeFile(
		fileName,
		JSON.stringify(
			{
				fixes: {
					incompleteTypes: true,
					...(fixes.has(InitializationFix.NoImplicitAny) && {
						noImplicitAny: true,
					}),
					...(fixes.has(InitializationFix.NoImplicitThis) && {
						noImplicitThis: true,
					}),
				},
				...(sourceFiles && { include: [sourceFiles] }),
				projectPath,
			},
			undefined,
			4,
		),
	);
};
