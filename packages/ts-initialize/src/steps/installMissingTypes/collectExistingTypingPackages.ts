import * as fs from "node:fs/promises";
import path from "node:path";
import { EOL } from "node:os";
import { getQuickErrorSummary } from "typestat-utils";

import { TSInitializeOptions } from "../../types.js";

export const collectExistingTypingPackages = async (
	options: TSInitializeOptions,
) => {
	const allDependencies = await tryCollectAllDependencies(
		path.join(options.cwd, "package.json"),
	);
	if (typeof allDependencies === "string") {
		options.output.stderr(
			`${EOL}Error trying to collect existing dependencies:`,
		);
		options.output.stderr(`\t${allDependencies}`);
		options.output.stderr(EOL);
		return undefined;
	}

	return Array.from(allDependencies)
		.filter((dependency) => dependency.startsWith("@types/"))
		.map((dependency) => dependency.substring("@types/".length));
};

const tryCollectAllDependencies = async (packagePath: string) => {
	try {
		return collectAllDependencies(packagePath);
	} catch (error) {
		return getQuickErrorSummary(error);
	}
};

const collectAllDependencies = async (packagePath: string) => {
	const rawContents = (await fs.readFile(packagePath)).toString();
	const parsedContents = JSON.parse(rawContents) as Record<
		string,
		Record<string, string> | undefined
	>;

	const allDependencies: string[] = [];

	for (const groupName of [
		"dependencies",
		"devDependencies",
		"peerDependencies",
	]) {
		const packageObject = parsedContents[groupName];

		if (packageObject !== undefined) {
			allDependencies.push(...Object.keys(packageObject));
		}
	}

	return new Set(allDependencies);
};
