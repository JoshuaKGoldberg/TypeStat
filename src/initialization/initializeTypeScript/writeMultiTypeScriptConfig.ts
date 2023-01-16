import { fs } from "mz";
import { ProjectDescription } from "../initializeProject/shared";

import { InitializationImprovement } from "./improvements";

export interface MultiTypeScriptConfigSettings {
    fileName: string;
    improvements: ReadonlySet<InitializationImprovement>;
    project: ProjectDescription;
    sourceFiles?: string;
    testFiles?: string;
}

export const writeMultiTypeScriptConfig = async ({
    fileName,
    improvements,
    project,
    sourceFiles,
    testFiles,
}: MultiTypeScriptConfigSettings) => {
    await fs.writeFile(
        fileName,
        JSON.stringify(
            [
                {
                    fixes: {
                        ...printImprovements(improvements),
                        strictNonNullAssertions: true,
                    },
                    ...(testFiles && { include: [testFiles] }),
                    projectPath: project.filePath,
                    types: {
                        strictNullChecks: true,
                    },
                },
                {
                    ...(testFiles && { exclude: [testFiles] }),
                    fixes: printImprovements(improvements),
                    ...(sourceFiles && { include: [sourceFiles] }),
                    projectPath: project.filePath,
                },
                {
                    fixes: printImprovements(improvements),
                    ...(testFiles ? { include: [testFiles, sourceFiles] } : { include: [sourceFiles] }),
                    projectPath: project.filePath,
                },
            ],
            undefined,
            4,
        ),
    );
};

const printImprovements = (improvements: ReadonlySet<InitializationImprovement>) => {
    return {
        incompleteTypes: true,
        ...(improvements.has(InitializationImprovement.NoImplicitAny) && { noImplicitAny: true }),
        ...(improvements.has(InitializationImprovement.NoInferableTypes) && { inferableTypes: true }),
        ...(improvements.has(InitializationImprovement.NoImplicitThis) && { noImplicitThis: true }),
    };
};
