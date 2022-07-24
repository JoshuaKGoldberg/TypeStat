import { fs } from "mz";
import { getNewFileName } from "./getNewFileName";

import { BaseTypeStatOptions, TypeStatOptions } from "./types";

export const processFileRenames = async (
    fileNames: ReadonlyArray<string>,
    options: BaseTypeStatOptions,
): Promise<BaseTypeStatOptions | string> => {
    return options.files.renameExtensions ? renameOptionFiles(options, fileNames) : ensureNoJsFiles(options, fileNames);
};

const renameOptionFiles = async (options: BaseTypeStatOptions, fileNames: ReadonlyArray<string>): Promise<TypeStatOptions> => {
    const newFileNames = new Set(fileNames);

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

    if (filesToRename.length !== 0) {
        options.output.stdout(`Renaming ${filesToRename.length} files...`);

        for (const { oldFileName, newFileName } of filesToRename) {
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

const validRenameExtensions = new Set([".cjs", ".cjsx", ".js", ".jsx", ".mjs", ".mjsx"]);

const canBeRenamed = (oldFileName: string): boolean => {
    const oldExtension = oldFileName.substring(oldFileName.lastIndexOf("."));

    return validRenameExtensions.has(oldExtension);
};

const ensureNoJsFiles = async (options: BaseTypeStatOptions, fileNames: ReadonlyArray<string>): Promise<BaseTypeStatOptions | string> => {
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
