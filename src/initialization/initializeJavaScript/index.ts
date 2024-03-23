import * as fs from "node:fs/promises";

import { ProjectDescription } from "../initializeProject/shared.js";
import { initializeSources } from "../sources/index.js";
import { initializeCleanups } from "./cleanups.js";
import { createJavaScriptConfig } from "./createJavaScriptConfig.js";
import { initializeImports } from "./imports.js";
import { initializeRenames } from "./renames.js";

export interface InitializeJavaScriptSettings {
	fileName: string;
	project: ProjectDescription;
}

export const initializeJavaScript = async ({
	fileName,
	project,
}: InitializeJavaScriptSettings) => {
	const sourceFiles = await initializeSources({
		fromJavaScript: true,
		project,
	});
	const renames = await initializeRenames();
	const imports = await initializeImports();
	const cleanups = await initializeCleanups();

	const settings = createJavaScriptConfig({
		cleanups,
		imports,
		project,
		renames,
		sourceFiles,
	});

	await fs.writeFile(fileName, JSON.stringify(settings, undefined, 4));
};
