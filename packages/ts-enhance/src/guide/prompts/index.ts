import * as path from "node:path";

import { TSEnhanceArgv } from "../../types.js";
import { InitializationFix, promptForFixes } from "./promptForFixes.js";
import { promptForSourceFiles } from "./promptForSourceFiles.js";
import { promptForTestFiles } from "./promptForTestFiles.js";
import { writeMultiTypeScriptConfig } from "./writeMultiTypeScriptConfig.js";
import { writeSingleTypeScriptConfig } from "./writeSingleTypeScriptConfig.js";

export const runPrompts = async (argv: TSEnhanceArgv) => {
	const fileName = path.join(argv.cwd, "ts-enhance.json");

	const fixes = new Set(await promptForFixes());
	const sourceFiles = await promptForSourceFiles();

	if (!fixes.has(InitializationFix.StrictNullChecks)) {
		await writeSingleTypeScriptConfig({
			fileName,
			fixes: fixes,
			projectPath: argv.project,
			sourceFiles,
		});
		return;
	}

	const testFiles = await promptForTestFiles();

	await writeMultiTypeScriptConfig({
		fileName,
		fixes,
		projectPath: argv.project,
		sourceFiles,
		testFiles,
	});
};
