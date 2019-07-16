import { fs } from "mz";

import { InitializationImprovement } from "./improvements";

export interface SingleTypeScriptConfigSettings {
    fileName: string;
    improvements: ReadonlySet<InitializationImprovement>;
    sourceFiles: string;
}

export const writeSingleTypeScriptConfig = async ({ fileName, sourceFiles, improvements }: SingleTypeScriptConfigSettings) => {
    await fs.writeFile(
        fileName,
        JSON.stringify(
            {
                fixes: printImprovements(improvements),
                include: [sourceFiles],
            },
            undefined,
            4,
        ),
    );
};

const printImprovements = (improvements: ReadonlySet<InitializationImprovement>) => {
    return {
        incompleteTypes: true,
        ...(improvements.has(InitializationImprovement.NoImplicitAny) && { noImplicitAny: true }),
        ...(improvements.has(InitializationImprovement.NoImplicitThis) && { noImplicitThis: true }),
    };
};
