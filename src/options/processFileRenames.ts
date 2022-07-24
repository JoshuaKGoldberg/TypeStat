import { fs } from "mz";
import { getNewFileName } from "./getNewFileName";

import { TypeStatOptions } from "./types";

export const processFileRenames = async (options: TypeStatOptions | string): Promise<TypeStatOptions | string> => {
    if (typeof options === "string" || options.fileNames === undefined) {
        return options;
    }

    return options.files.renameExtensions ? renameOptionFiles(options, options.fileNames) : ensureNoJsFiles(options, options.fileNames);
};

const renameOptionFiles = async (options: TypeStatOptions, fileNames: ReadonlyArray<string>): Promise<TypeStatOptions> => {
    const newFileNames = new Set(options.fileNames);

    const filesToRename = (
        await Promise.all(
            fileNames.filter(canBeRenamed).map(async (fileName) => ({
                newFileName: await getNewFileName(options.files.renameExtensions, fileName, async (filePath: string) =>
                    (await fs.readFile(filePath)).toString(),
                ),
                oldFileName: fileName,
            })),
        )
    ).filter(({ newFileName, oldFileName }) => newFileName !== oldFileName);

    if (filesToRename.length === 0) {
        return options;
    }

    options.output.stdout(`Renaming ${filesToRename.length} files...`);

    for (const { oldFileName, newFileName } of filesToRename) {
        await fs.rename(oldFileName, newFileName);

        newFileNames.delete(oldFileName);
        newFileNames.add(newFileName);
    }

    return {
        ...options,
        fileNames: Array.from(newFileNames),
    };
};

const validRenameExtensions = new Set([".cjs", ".cjsx", ".js", ".jsx", ".mjs", ".mjsx"]);

const canBeRenamed = (oldFileName: string): boolean => {
    const oldExtension = oldFileName.substring(oldFileName.lastIndexOf("."));

    return validRenameExtensions.has(oldExtension);
};

const ensureNoJsFiles = async (options: TypeStatOptions, fileNames: ReadonlyArray<string>): Promise<TypeStatOptions | string> => {
    const jsFileNames = fileNames.filter((fileName) => fileName.endsWith(".js") || fileName.endsWith(".jsx"));
    if (jsFileNames.length === 0) {
        return options;
    }

    return [
        "The following JavaScript files were included in the project but files.renameExtensions is not enabled.",
        "TypeStat does not yet support annotating JavaScript files.",
        ...jsFileNames.map((fileName) => `\t${fileName}`),
        "See https://github.com/JoshuaKGoldberg/TypeStat/blob/main/docs/Files.md for details.",
    ].join("\n");
};
