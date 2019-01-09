import { fs, readline } from "mz";

import { TypeStatOptions } from "./types";

export const processFileRenames = async (options: TypeStatOptions): Promise<TypeStatOptions> => {
    if (!options.files.renameExtensions || options.fileNames === undefined) {
        return options;
    }

    const newFileNames = new Set(options.fileNames);

    const filesToRename = options.fileNames
        .map((fileName) => ({
            newFileName: fileName.replace(/.js$/i, ".ts").replace(/.jsx$/i, ".tsx"),
            oldFileName: fileName,
        }))
        .filter(({ newFileName, oldFileName }) => newFileName !== oldFileName);

    if (filesToRename.length === 0) {
        return options;
    }

    options.logger.stdout.write(`Renaming ${filesToRename.length} files...\n`);

    for (const { oldFileName, newFileName } of filesToRename) {
        await fs.rename(oldFileName, newFileName);

        newFileNames.delete(oldFileName);
        newFileNames.add(newFileName);
    }

    readline.moveCursor(options.logger.stdout, 0, -1);
    readline.clearLine(options.logger.stdout, 0);

    return {
        ...options,
        fileNames: Array.from(newFileNames),
    };
};
