import { ProjectDescription } from "../initializeProject/shared";
import { InitializationImports } from "./imports";
import { InitializationRenames } from "./renames";
import { InitializationSuppressions } from "./suppressions";

export interface JavaScriptConfigSettings {
    imports: InitializationImports;
    project: ProjectDescription;
    renames: InitializationRenames;
    sourceFiles?: string;
    suppressions: InitializationSuppressions;
}

export const createJavaScriptConfig = ({ imports, project, sourceFiles, suppressions, renames }: JavaScriptConfigSettings) => {
    const fileConversion = {
        files: {
            renameExtensions: printRenames(renames),
        },
    };
    const coreConversion = {
        fixes: {
            incompleteTypes: true,
            missingProperties: true,
            noImplicitAny: true,
        },
        ...(suppressions === InitializationSuppressions.Yes ? { suppressions: { typeErrors: true } } : {}),
    };
    const shared = (include: string[] | undefined) => ({
        ...(include && { include }),
        project: project.filePath,
    });

    const allConversions =
        imports === InitializationImports.Yes
            ? [
                  {
                      ...fileConversion,
                      fixes: {
                          importExtensions: true,
                      },
                      ...shared(sourceFiles ? [sourceFiles] : undefined),
                  },
                  {
                      ...coreConversion,
                      ...shared(
                          sourceFiles
                              ? renames === InitializationRenames.Auto
                                  ? renameSourceFilesExtensionsAuto(sourceFiles)
                                  : renames === InitializationRenames.TS
                                  ? renameSourceFilesExtensions(sourceFiles, "ts")
                                  : renameSourceFilesExtensions(sourceFiles, "tsx")
                              : undefined,
                      ),
                  },
              ]
            : {
                  ...fileConversion,
                  ...coreConversion,
                  ...shared(sourceFiles ? [sourceFiles] : undefined),
              };

    return allConversions;
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

function renameSourceFilesExtensionsAuto(sourceFiles: string) {
    for (const [original, replacement] of [
        [/\{js,jsx\}/, "{ts,tsx}"],
        [/\.js$/, ".{ts,tsx}"],
    ] as const) {
        sourceFiles = sourceFiles.replace(original, replacement);
    }

    return renameSourceFilesExtensions(sourceFiles, "ts");
}

function renameSourceFilesExtensions(sourceFiles: string, extension: string) {
    return [sourceFiles.replace(/(\.|{)js/, `$1${extension}`).replace(new RegExp(`{${extension},jsx?}`), extension)];
}
