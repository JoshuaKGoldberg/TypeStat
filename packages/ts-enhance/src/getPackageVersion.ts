import * as fs from "node:fs/promises";
import * as path from "node:path";

export const getPackageVersion = async (): Promise<string> => {
	const packagePath = path.join(__dirname, "../../package.json");
	const rawText = (await fs.readFile(packagePath)).toString();

	return (JSON.parse(rawText) as { version: string }).version;
};
