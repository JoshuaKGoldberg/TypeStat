import chalk from "chalk";
import { fs } from "mz";
import { pluralize } from "../../../output/pluralize";

import { createSingleUseProvider } from "../../createSingleUseProvider";
import { getNewFileName } from "./getNewFileName";

/**
 * Creates a mutations provider that renames files from JavaScript to TypeScript.
 *
 * @param allModifiedFileNames   Set to mark names of all files that were modified.
 * @returns Provider to rename files from JavaScript to TypeScript, if needed.
 */
export const createFileRenamesProvider = (allModifiedFiles: Set<string>) => {
    return createSingleUseProvider("Renaming files from JavaScript to TypeScript", (options) => {
        // If the options don't specify to rename extension, create a provider that only makes sure no JS files are included
        if (!options.files.renameExtensions) {
            return async () => {
                const jsFileNames = options.fileNames.filter(fileNameIsJavaScript);
                if (jsFileNames.length === 0) {
                    return undefined;
                }

                throw new Error(
                    [
                        "The following JavaScript files were included in the project but files.renameExtensions is not enabled.",
                        "TypeStat does not yet support annotating JavaScript files.",
                        ...jsFileNames.map((fileName) => `\t${fileName}`),
                        "See https://github.com/JoshuaKGoldberg/TypeStat/blob/main/docs/Files.md for details.",
                    ].join("\n"),
                );
            };
        }

        return async () => {
            const newFileNames = new Set(options.fileNames);

            const filesToRename = (
                await Promise.all(
                    options.fileNames.filter(fileNameIsJavaScript).map(async (fileName) => ({
                        newFileName: await getNewFileName(options.files.renameExtensions, fileName, async (filePath: string) =>
                            (await fs.readFile(filePath)).toString(),
                        ),
                        oldFileName: fileName,
                    })),
                )
            ).filter(({ newFileName, oldFileName }) => newFileName !== oldFileName);

            if (filesToRename.length !== 0) {
                for (const { oldFileName, newFileName } of filesToRename) {
                    await fs.rename(oldFileName, newFileName);

                    newFileNames.delete(oldFileName);
                    newFileNames.add(newFileName);
                    allModifiedFiles.add(newFileName);
                }
            }

            const renamedFileNames = Array.from(newFileNames);

            options.output.stdout(
                chalk.gray(
                    `Renamed ${renamedFileNames.length} ${pluralize(renamedFileNames.length, "file")} from JavaScript to TypeScript.`,
                ),
            );

            return {
                newOptions: { ...options, fileNames: renamedFileNames },
            };
        };
    });
};

const javaScriptExtensionMatcher = /\.(c|m)?jsx?/i;

const fileNameIsJavaScript = (fileName: string) => javaScriptExtensionMatcher.test(fileName);
