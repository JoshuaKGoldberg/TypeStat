import { runCommand } from "../../../../typestat-utils/src/runCommand.js";
import { TSInitializeOptions } from "../../types.js";

export const installWithYarn = async (
	options: TSInitializeOptions,
	missingPackageNames: readonly string[],
) => {
	await runCommand(
		[
			"yarn",
			"add",
			...Array.from(missingPackageNames).map(
				(packageName) => `@types/${packageName}`,
			),
			"-D",
		].join(" "),
		options,
	);
};
