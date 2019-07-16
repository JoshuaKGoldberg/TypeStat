import { promises as fs } from "fs";

import { InitializationImprovement } from "./improvements";

export interface MultiTypeScriptConfigSettings {
    fileName: string;
    improvements: ReadonlySet<InitializationImprovement>;
    sourceFiles: string;
    testFiles: string;
}

export const writeMultiTypeScriptConfig = async ({ fileName, improvements, sourceFiles, testFiles }: MultiTypeScriptConfigSettings) => {
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
                },
                {
                    exclude: [testFiles],
                    fixes: printImprovements(improvements),
                    include: [sourceFiles],
                },
                {
                    fixes: printImprovements(improvements),
                    include: [testFiles, sourceFiles],
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
        ...(improvements.has(InitializationImprovement.ExtraneousTypes) && { extraneousTypes: true }),
        ...(improvements.has(InitializationImprovement.NoImplicitAny) && { noImplicitAny: true }),
        ...(improvements.has(InitializationImprovement.NoImplicitThis) && { noImplicitThis: true }),
    };
};
