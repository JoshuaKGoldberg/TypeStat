import * as fs from "node:fs";

export const readCharactersOfFile = (
	fileName: string,
	length: number,
): string => {
	const fd = fs.openSync(fileName, "r");
	const buffer = Buffer.alloc(length);

	fs.readSync(fd, buffer, 0, length, 0);

	return buffer.toString();
};
