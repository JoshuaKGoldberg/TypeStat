import { glob } from "node:fs/promises";
import path from "node:path";

export interface CollectFileNamesResult {
	error?: string;
	fileNames: readonly string[];
}

export const collectFileNames = async (
	cwd: string,
	include: readonly string[] | undefined,
): Promise<CollectFileNamesResult | undefined> => {
	if (!include?.length) {
		return undefined;
	}

	const fileNames = await collectFileNamesFromGlobs(cwd, include);
	const implicitNodeModulesInclude = implicitNodeModulesIncluded(
		include,
		fileNames,
	);

	if (implicitNodeModulesInclude) {
		return {
			error: `At least one path including node_modules was included implicitly: '${implicitNodeModulesInclude}'. Either adjust TypeStat's included files to not include node_modules (recommended) or explicitly include node_modules/ (not recommended).`,
			fileNames: [],
		};
	}

	return { fileNames };
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
): string | undefined => {
	if (fileGlobs.some((glob) => glob.includes("node_modules"))) {
		return undefined;
	}
	return fileNames.find((fileName) => fileName.includes("node_modules"));
};
