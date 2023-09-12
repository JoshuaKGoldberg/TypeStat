import * as path from "node:path";

export const normalizeAndSlashify = (filePath: string) =>
	path.normalize(filePath).replace(/\\/g, "/");
