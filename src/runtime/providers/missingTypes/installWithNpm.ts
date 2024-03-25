import { TypeStatOptions } from "../../../options/types.js";
import { runCommand } from "./runCommand.js";

export const installWithNpm = async (
	options: TypeStatOptions,
	missingPackageNames: readonly string[],
) => {
	await runCommand(
		options,
		[
			"npm",
			"install",
			...Array.from(missingPackageNames).map(
				(packageName) => `@types/${packageName}`,
			),
			"-D",
		].join(" "),
	);
};
