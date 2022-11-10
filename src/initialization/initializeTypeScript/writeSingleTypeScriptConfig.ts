import { fs } from "mz";

import { ProjectDescription } from "../initializeProject/shared";
import { InitializationImprovement } from "./improvements";

export interface SingleTypeScriptConfigSettings {
    fileName: string;
    project: ProjectDescription;
    improvements: ReadonlySet<InitializationImprovement>;
    sourceFiles?: string;
}

export const writeSingleTypeScriptConfig = async ({ fileName, project, sourceFiles, improvements }: SingleTypeScriptConfigSettings) => {
    await fs.writeFile(
        fileName,
        JSON.stringify(
            {
                fixes: printImprovements(improvements),
                ...(sourceFiles && { include: [sourceFiles] }),
                projectPath: project.filePath,
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
