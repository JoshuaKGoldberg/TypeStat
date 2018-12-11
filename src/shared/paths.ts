import * as path from "path";

export const normalizeAndSlashify = (filePath: string) => path.normalize(filePath).replace(/\\/g, "/");
