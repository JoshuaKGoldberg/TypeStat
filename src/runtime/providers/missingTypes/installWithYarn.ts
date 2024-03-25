import { TypeStatOptions } from "../../../options/types.js";
import { runCommand } from "./runCommand.js";

export const installWithYarn = async (
	options: TypeStatOptions,
	missingPackageNames: readonly string[],
) => {
	await runCommand(
		options,
		[
			"yarn",
			"add",
			...Array.from(missingPackageNames).map(
				(packageName) => `@types/${packageName}`,
			),
			"-D",
		].join(" "),
	);
};
