import { glob } from "node:fs/promises";
import path from "node:path";

export const collectFileNames = async (
	cwd: string,
	include: readonly string[] | undefined,
): Promise<readonly string[] | string | undefined> => {
	if (include === undefined) {
		return undefined;
	}

	const fileNames = await collectFileNamesFromGlobs(cwd, include);
	const implicitNodeModulesInclude = implicitNodeModulesIncluded(
		include,
		fileNames,
	);

	if (implicitNodeModulesInclude) {
		return `At least one path including node_modules was included implicitly: '${implicitNodeModulesInclude}'. Either adjust TypeStat's included files to not include node_modules (recommended) or explicitly include node_modules/ (not recommended).`;
	}

	return fileNames;
};

const collectFileNamesFromGlobs = async (
	cwd: string,
	include: readonly string[],
): Promise<readonly string[]> => {
	const fileNames: string[] = [];
	for await (const entry of glob(include, { cwd, withFileTypes: true })) {
		fileNames.push(path.join(entry.parentPath, entry.name));
	}
	return fileNames;
};

const implicitNodeModulesIncluded = (
	fileGlobs: readonly string[],
	fileNames: readonly string[],
): boolean => {
	return (
		!fileGlobs.some((glob) => glob.includes("node_modules")) &&
		fileNames.some((fileName) => fileName.includes("node_modules"))
	);
};
