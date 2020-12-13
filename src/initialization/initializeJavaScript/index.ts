import { initializeSources } from "../sources";

import { initializeImports } from "./imports";
import { initializeRenames } from "./renames";
import { writeJavaScriptConfig } from "./writeJavaScriptConfig";

export interface InitializeJavaScriptSettings {
    fileName: string;
    project: string;
}

export const initializeJavaScript = async ({ fileName, project }: InitializeJavaScriptSettings) => {
    const sourceFiles = await initializeSources({ fromJavaScript: true });
    const renames = await initializeRenames();
    const imports = await initializeImports();

    await writeJavaScriptConfig({ fileName, imports, project, sourceFiles, renames });
};
