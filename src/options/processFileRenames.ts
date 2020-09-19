import { fs } from "mz";

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
                newFileName: await getNewFileName(options, fileName),
                oldFileName: fileName,
            })),
        )
    ).filter(({ newFileName, oldFileName }) => newFileName !== oldFileName);

    if (filesToRename.length === 0) {
        return options;
    }

    options.logger.stdout.write(`Renaming ${filesToRename.length} files...\n`);

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

const validRenameExtensions = new Set([".js", ".jsx"]);

const canBeRenamed = (oldFileName: string): boolean => {
    const oldExtension = oldFileName.substring(oldFileName.lastIndexOf("."));

    return validRenameExtensions.has(oldExtension);
};

const getNewFileName = async (options: TypeStatOptions, oldFileName: string): Promise<string> => {
    const oldExtension = oldFileName.substring(oldFileName.lastIndexOf("."));
    const beforeExtension = oldFileName.substring(0, oldFileName.length - oldExtension.length);

    if (options.files.renameExtensions === "tsx" || oldExtension === ".jsx") {
        return `${beforeExtension}.tsx`;
    }

    if (options.files.renameExtensions === "ts") {
        return `${beforeExtension}.ts`;
    }

    const fileContents = (await fs.readFile(oldFileName)).toString();
    const fileContentsJoined = fileContents.replace(/ /g, "").replace(/"/g, "'");

    if (fileContentsJoined.includes(`require('react')`) || fileContentsJoined.includes(`from'react'`)) {
        return `${beforeExtension}.tsx`;
    }

    return `${beforeExtension}.ts`;
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
