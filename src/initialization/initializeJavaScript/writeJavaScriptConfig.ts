import { writeFile } from "mz/fs";

import { InitializationRenames } from "./renames";

export interface JavaScriptConfigSettings {
    fileName: string;
    project: string;
    renames: InitializationRenames;
    sourceFiles: string;
}

export const writeJavaScriptConfig = async ({ fileName, project, sourceFiles, renames }: JavaScriptConfigSettings) => {
    await writeFile(
        fileName,
        JSON.stringify(
            {
                files: {
                    renameExtensions: printRenames(renames),
                },
                fixes: {
                    incompleteTypes: true,
                    missingProperties: true,
                    noImplicitAny: true,
                },
                include: [sourceFiles],
                project,
            },
            undefined,
            4,
        ),
    );
};

const printRenames = (renames: InitializationRenames) => {
    switch (renames) {
        case InitializationRenames.Auto:
            return true;

        case InitializationRenames.TS:
            return "ts";

        case InitializationRenames.TSX:
            return "tsx";
    }
};
