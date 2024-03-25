import * as fs from "node:fs/promises";
import { EOL } from "os";

import { TypeStatOptions } from "../../../options/types.js";
import { getQuickErrorSummary } from "../../../shared/errors.js";

export const collectExistingTypingPackages = async (
	options: TypeStatOptions,
	packagePath: string,
) => {
	const allDependencies = await tryCollectAllDependencies(packagePath);
	if (typeof allDependencies === "string") {
		options.output.stderr(
			`${EOL}Error trying to collect existing dependencies for --packageMissingTypes:`,
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
