import { fs } from "mz";
import { promisify } from "util";

import { InitializationImprovement } from "./improvements";

export interface MultiTypeScriptConfigSettings {
    fileName: string;
    improvements: ReadonlySet<InitializationImprovement>;
    project: string;
    sourceFiles: string;
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
                    project,
                },
                {
                    exclude: [testFiles],
                    fixes: printImprovements(improvements),
                    include: [sourceFiles],
                    project,
                },
                {
                    fixes: printImprovements(improvements),
                    include: [testFiles, sourceFiles],
                    project,
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
