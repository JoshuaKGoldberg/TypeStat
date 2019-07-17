import { fs } from "mz";

import { InitializationImprovement } from "./improvements";

export interface SingleTypeScriptConfigSettings {
    fileName: string;
    project: string;
    improvements: ReadonlySet<InitializationImprovement>;
    sourceFiles: string;
}

export const writeSingleTypeScriptConfig = async ({ fileName, project, sourceFiles, improvements }: SingleTypeScriptConfigSettings) => {
    await fs.writeFile(
        fileName,
        JSON.stringify(
            {
                fixes: printImprovements(improvements),
                include: [sourceFiles],
                project,
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
