import { initializeSources } from "../sources";

import { initializeRenames } from "./renames";
import { writeJavaScriptConfig } from "./writeJavaScriptConfig";

export const initializeJavaScript = async (fileName: string) => {
    const sourceFiles = await initializeSources({ fromJavaScript: true });
    const renames = await initializeRenames();

    await writeJavaScriptConfig({ fileName, sourceFiles, renames });
};
