import { fs, readline } from "mz";

import { TypeStatOptions } from "./types";

export const processFileRenames = async (options: TypeStatOptions): Promise<TypeStatOptions | string> => {
    if (options.fileNames === undefined) {
        return options;
    }

    return options.files.renameExtensions ? renameOptionFiles(options, options.fileNames) : ensureNoJsFiles(options, options.fileNames);
};

const renameOptionFiles = async (options: TypeStatOptions, fileNames: ReadonlyArray<string>): Promise<TypeStatOptions> => {
    const newFileNames = new Set(options.fileNames);

    const filesToRename = fileNames
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

const ensureNoJsFiles = async (options: TypeStatOptions, fileNames: ReadonlyArray<string>): Promise<TypeStatOptions | string> => {
    const jsFileNames = fileNames.filter((fileName) => fileName.endsWith(".js") || fileName.endsWith(".jsx"));
    if (jsFileNames.length === 0) {
        return options;
    }

    return [
        "The following JavaScript files were included in the project but --fileRenameExtensions is not enabled.",
        "TypeStat does not yet support annotating JavaScript files.",
        ...jsFileNames.map((fileName) => `\t${fileName}`),
    ].join("\n");
};
