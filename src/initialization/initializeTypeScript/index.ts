import { ProjectDescription } from "../initializeProject/shared.js";
import { initializeSources } from "../sources/index.js";
import {
	InitializationImprovement,
	initializeImprovements,
} from "./improvements.js";
import { initializeTests } from "./initializeTests.js";
import { writeMultiTypeScriptConfig } from "./writeMultiTypeScriptConfig.js";
import { writeSingleTypeScriptConfig } from "./writeSingleTypeScriptConfig.js";

export interface InitializeTypeScriptSettings {
	fileName: string;
	project: ProjectDescription;
}

export const initializeTypeScript = async ({
	fileName,
	project,
}: InitializeTypeScriptSettings) => {
	const improvements = new Set(await initializeImprovements());
	const sourceFiles = await initializeSources({
		fromJavaScript: false,
		project,
	});

	if (!improvements.has(InitializationImprovement.StrictNullChecks)) {
		await writeSingleTypeScriptConfig({
			fileName,
			improvements,
			project,
			sourceFiles,
		});
		return;
	}

	const testFiles = await initializeTests();
	await writeMultiTypeScriptConfig({
		fileName,
		improvements,
		project,
		sourceFiles,
		testFiles,
	});
};
