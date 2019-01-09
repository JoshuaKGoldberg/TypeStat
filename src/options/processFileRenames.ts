import * as fs from "mz/fs";

import { TypeStatOptions } from "./types";

export const processFileRenames = async (options: TypeStatOptions): Promise<TypeStatOptions> => {
    if (!options.files.renameExtensions || options.fileNames === undefined) {
        return options;
    }

    const newFileNames = new Set(options.fileNames);

    // For each file, if it's matched by .js(x), convert it to .ts(x)
    for (const oldFileName of options.fileNames) {
        const newFileName = oldFileName.replace(/.js$/i, ".ts").replace(/.jsx$/i, ".tsx");

        if (newFileName !== oldFileName) {
            await fs.rename(oldFileName, newFileName);

            newFileNames.delete(oldFileName);
            newFileNames.add(newFileName);
        }
    }

    return {
        ...options,
        fileNames: Array.from(newFileNames),
    };
};
