import { runCommand } from "../../../../typestat-utils/src/runCommand.js";
import { TSInitializeOptions } from "../../types.js";

export const installWithNpm = async (
	options: TSInitializeOptions,
	missingPackageNames: readonly string[],
) => {
	await runCommand(
		[
			"npm",
			"install",
			...Array.from(missingPackageNames).map(
				(packageName) => `@types/${packageName}`,
			),
			"-D",
		].join(" "),
		options,
	);
};
