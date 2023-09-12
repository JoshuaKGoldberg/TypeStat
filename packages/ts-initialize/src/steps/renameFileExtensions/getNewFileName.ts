import { FileExtensions } from "../../types.js";

export const getNewFileName = async (
	fileExtensions: FileExtensions,
	oldFileName: string,
	readFile: (filePath: string) => Promise<string>,
): Promise<string> => {
	const oldExtension = oldFileName.substring(oldFileName.lastIndexOf("."));
	const beforeExtension = oldFileName.substring(
		0,
		oldFileName.length - oldExtension.length,
	);

	switch (fileExtensions) {
		case FileExtensions.TSX:
			return `${beforeExtension}.tsx`;
		case FileExtensions.TS:
			return `${beforeExtension}.ts`;
	}

	const fileContents = (await readFile(oldFileName)).toString();
	const fileContentsJoined = fileContents.replace(/ /g, "").replace(/"/g, "'");

	if (/<\s*\/\s*(?:[A-Za-z.]+\s*)?>|\/\s*>/.test(fileContentsJoined)) {
		return `${beforeExtension}.tsx`;
	}

	return `${beforeExtension}.ts`;
};
