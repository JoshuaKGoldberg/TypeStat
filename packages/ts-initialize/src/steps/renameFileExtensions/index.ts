import chalk from "chalk";
import * as fs from "node:fs/promises";
import { pluralize } from "typestat-utils";

import { TSInitializeOptions } from "../../types.js";
import { fileNameIsJavaScript } from "./fileNameIsJavaScript.js";
import { getNewFileName } from "./getNewFileName.js";

export const renameFileExtensions = async (options: TSInitializeOptions) => {
	const filesToRename = (
		await Promise.all(
			options.filePaths.filter(fileNameIsJavaScript).map(async (fileName) => ({
				newFileName: await getNewFileName(
					options.fileExtensions,
					fileName,
					async (filePath: string) => (await fs.readFile(filePath)).toString(),
				),
				oldFileName: fileName,
			})),
		)
	).filter(({ newFileName, oldFileName }) => newFileName !== oldFileName);

	for (const { newFileName, oldFileName } of filesToRename) {
		await fs.rename(oldFileName, newFileName);
	}

	options.output.stdout(
		chalk.gray(
			`Renamed ${filesToRename.length} ${pluralize(
				filesToRename.length,
				"file",
			)} from JavaScript to TypeScript.`,
		),
	);
};
