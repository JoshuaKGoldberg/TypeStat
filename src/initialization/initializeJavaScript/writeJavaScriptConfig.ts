import { writeFile } from "mz/fs";

import { InitializationImports } from "./imports";
import { InitializationRenames } from "./renames";

export interface JavaScriptConfigSettings {
    fileName: string;
    imports: InitializationImports;
    project: string;
    renames: InitializationRenames;
    sourceFiles?: string;
}

export const writeJavaScriptConfig = async ({ fileName, imports, project, sourceFiles, renames }: JavaScriptConfigSettings) => {
    const fileConversion = {
        files: {
            renameExtensions: printRenames(renames),
        },
    };
    const fixConversion = {
        fixes: {
            incompleteTypes: true,
            missingProperties: true,
            noImplicitAny: true,
        },
    };
    const shared = {
        ...(sourceFiles && { include: [sourceFiles] }),
        project,
    };

    const allConversions =
        imports === InitializationImports.Yes
            ? [
                  {
                      ...fileConversion,
                      fixes: {
                          importExtensions: true,
                      },
                      ...shared,
                  },
                  {
                      ...fixConversion,
                      ...shared,
                  },
              ]
            : {
                  ...fileConversion,
                  ...fixConversion,
                  ...shared,
              };

    await writeFile(fileName, JSON.stringify(allConversions, undefined, 4));
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
