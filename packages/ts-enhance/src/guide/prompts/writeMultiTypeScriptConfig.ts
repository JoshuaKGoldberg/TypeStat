import * as fs from "node:fs/promises";

import { InitializationFix } from "./promptForFixes.js";

export interface MultiTypeScriptConfigSettings {
	fileName: string;
	fixes: ReadonlySet<InitializationFix>;
	projectPath: string;
	sourceFiles?: string;
	testFiles?: string;
}

export const writeMultiTypeScriptConfig = async ({
	fileName,
	fixes,
	projectPath,
	sourceFiles,
	testFiles,
}: MultiTypeScriptConfigSettings) => {
	await fs.writeFile(
		fileName,
		JSON.stringify(
			[
				{
					fixes: {
						...printImprovements(fixes),
						strictNonNullAssertions: true,
					},
					...(testFiles && { include: [testFiles] }),
					projectPath,
					types: {
						strictNullChecks: true,
					},
				},
				{
					...(testFiles && { exclude: [testFiles] }),
					fixes: printImprovements(fixes),
					...(sourceFiles && { include: [sourceFiles] }),
					projectPath,
				},
				{
					fixes: printImprovements(fixes),
					...(testFiles
						? { include: [testFiles, sourceFiles] }
						: { include: [sourceFiles] }),
					projectPath,
				},
			],
			undefined,
			4,
		),
	);
};

const printImprovements = (improvements: ReadonlySet<InitializationFix>) => {
	return {
		incompleteTypes: true,
		...(improvements.has(InitializationFix.NoImplicitAny) && {
			noImplicitAny: true,
		}),
		...(improvements.has(InitializationFix.NoInferableTypes) && {
			inferableTypes: true,
		}),
		...(improvements.has(InitializationFix.NoImplicitThis) && {
			noImplicitThis: true,
		}),
	};
};
