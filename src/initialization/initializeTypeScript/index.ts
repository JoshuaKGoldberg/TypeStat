import { initializeSources } from "../sources";

import { InitializationImprovement, initializeImprovements } from "./improvements";
import { initializeTests } from "./initializeTests";
import { writeMultiTypeScriptConfig } from "./writeMultiTypeScriptConfig";
import { writeSingleTypeScriptConfig } from "./writeSingleTypeScriptConfig";

export const initializeTypeScript = async (fileName: string) => {
    const improvements = new Set(await initializeImprovements());
    const sourceFiles = await initializeSources({ fromJavaScript: false });

    if (!improvements.has(InitializationImprovement.StrictNullChecks)) {
        await writeSingleTypeScriptConfig({ fileName, improvements, sourceFiles });
        return;
    }

    const testFiles = await initializeTests();
    await writeMultiTypeScriptConfig({ fileName, improvements, sourceFiles, testFiles });
};
