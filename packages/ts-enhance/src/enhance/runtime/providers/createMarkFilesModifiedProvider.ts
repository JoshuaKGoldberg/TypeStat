import { FileMutations, TextInsertMutation } from "automutate";
import * as fs from "node:fs/promises";

import { TSEnhanceOptions } from "../../../options/types.js";
import { printNewLine } from "../../../shared/printing/newlines.js";
import { createSingleUseProvider } from "../createSingleUseProvider.js";

/**
 * Creates a mutations provider to mark all previously mutated files as modified.
 * @returns Mutations provider to mark all mutated files as modified, if needed.
 */
export const createMarkFilesModifiedProvider = (
	allModifiedFileNames: ReadonlySet<string>,
) => {
	return createSingleUseProvider("Marking files as modified", (options) => {
		if (options.files.above === "" && options.files.below === "") {
			return undefined;
		}

		return async () => {
			const fileMutations: FileMutations = {};
			let hadMutation = false;

			for (const fileName of allModifiedFileNames) {
				const mutations = await createFileMutations(options, fileName);

				if (mutations.length !== 0) {
					fileMutations[fileName] = mutations;
					hadMutation = true;
				}
			}

			return {
				mutationsWave: {
					fileMutations: hadMutation ? fileMutations : undefined,
				},
			};
		};
	});
};

const createFileMutations = async (
	options: TSEnhanceOptions,
	fileName: string,
): Promise<TextInsertMutation[]> => {
	const mutations: TextInsertMutation[] = [];
	const fileContents = (await fs.readFile(fileName)).toString();
	const fileContentsTrimmed = fileContents.trim();
	const newLine = printNewLine(options.compilerOptions);

	if (
		options.files.above !== "" &&
		!fileContentsTrimmed.startsWith(options.files.above)
	) {
		mutations.push({
			insertion: `${options.files.above}${newLine}`,
			range: {
				begin: 0,
				end: 0,
			},
			type: "text-insert",
		});
	}

	if (
		options.files.below !== "" &&
		!fileContentsTrimmed.endsWith(options.files.below)
	) {
		mutations.push({
			insertion: `${newLine}${options.files.below}`,
			range: {
				begin: getInsertionIndexBeforeLastEndline(fileContents),
			},
			type: "text-insert",
		});
	}

	return mutations;
};

const getInsertionIndexBeforeLastEndline = (fileContents: string): number => {
	if (fileContents.length === 0) {
		return 0;
	}

	let index = fileContents.length - 1;

	for (const character of ["\n", "\r"]) {
		if (fileContents[index] === character) {
			index -= 1;

			if (index === 0) {
				return 0;
			}
		}
	}

	return index + 1;
};
