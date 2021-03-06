import { fs } from "mz";

import { InitializationImprovement } from "./improvements";

export interface MultiTypeScriptConfigSettings {
    fileName: string;
    improvements: ReadonlySet<InitializationImprovement>;
    project: string;
    sourceFiles?: string;
    testFiles: string;
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
                    include: [testFiles],
                    projectPath: project,
                },
                {
                    exclude: [testFiles],
                    fixes: printImprovements(improvements),
                    ...(sourceFiles && { include: [sourceFiles] }),
                    projectPath: project,
                },
                {
                    fixes: printImprovements(improvements),
                    include: [testFiles, sourceFiles],
                    projectPath: project,
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
