import { initializeSources } from "../sources";

import { ProjectDescription } from "../initializeProject/shared";
import { InitializationImprovement, initializeImprovements } from "./improvements";
import { initializeTests } from "./initializeTests";
import { writeMultiTypeScriptConfig } from "./writeMultiTypeScriptConfig";
import { writeSingleTypeScriptConfig } from "./writeSingleTypeScriptConfig";

export interface InitializeTypeScriptSettings {
    fileName: string;
    project: ProjectDescription;
}

export const initializeTypeScript = async ({ fileName, project }: InitializeTypeScriptSettings) => {
    const improvements = new Set(await initializeImprovements());
    const sourceFiles = await initializeSources({ fromJavaScript: false, project });

    if (!improvements.has(InitializationImprovement.StrictNullChecks)) {
        await writeSingleTypeScriptConfig({ fileName, improvements, project, sourceFiles });
        return;
    }

    const testFiles = await initializeTests();
    await writeMultiTypeScriptConfig({ fileName, improvements, project, sourceFiles, testFiles });
};
