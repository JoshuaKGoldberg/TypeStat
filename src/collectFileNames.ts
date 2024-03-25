import { glob } from "glob";
import * as path from "node:path";

import { TypeStatArgv } from "./index.js";

export const collectFileNames = async (
	argv: TypeStatArgv,
	cwd: string,
	include: readonly string[] | undefined,
): Promise<readonly string[] | string | undefined> => {
	const globsAndNames = await collectFileNamesFromGlobs(argv, cwd, include);
	if (!globsAndNames) {
		return undefined;
	}

	const [fileGlobs, fileNames] = globsAndNames;
	const implicitNodeModulesInclude = implicitNodeModulesIncluded(
		fileGlobs,
		fileNames,
	);

	if (implicitNodeModulesInclude) {
		return `At least one path including node_modules was included implicitly: '${implicitNodeModulesInclude}'. Either adjust TypeStat's included files to not include node_modules (recommended) or explicitly include node_modules/ (not recommended).`;
	}

	return fileNames;
};

const collectFileNamesFromGlobs = async (
	argv: TypeStatArgv,
	cwd: string,
	include: readonly string[] | undefined,
): Promise<[readonly string[], readonly string[]] | undefined> => {
	if (argv.args.length) {
		return [argv.args, await glob(argv.args)];
	}

	if (include === undefined) {
		return undefined;
	}

	return [
		include,
		await glob(include.map((subInclude) => path.join(cwd, subInclude))),
	];
};

const implicitNodeModulesIncluded = (
	fileGlobs: readonly string[],
	fileNames: readonly string[] | undefined,
) => {
	return (
		!fileGlobs.some((glob) => glob.includes("node_modules")) &&
		fileNames?.find((fileName) => fileName.includes("node_modules"))
	);
};
