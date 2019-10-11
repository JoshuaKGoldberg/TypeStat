import { initializeSources } from "../sources";

import { initializeRenames } from "./renames";
import { writeJavaScriptConfig } from "./writeJavaScriptConfig";

export interface InitializeJavaScriptSettings {
    fileName: string;
    project: string;
}

export const initializeJavaScript = async ({ fileName, project }: InitializeJavaScriptSettings) => {
    const sourceFiles = await initializeSources({ fromJavaScript: true }),
        renames = await initializeRenames();

    await writeJavaScriptConfig({ fileName, project, sourceFiles, renames });
};
