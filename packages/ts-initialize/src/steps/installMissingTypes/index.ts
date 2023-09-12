import builtinModules from "builtin-modules";
import { setSubtract } from "typestat-utils";

import { TSInitializeOptions } from "../../types.js";
import { collectExistingTypingPackages } from "./collectExistingTypingPackages.js";
import { collectPackageManagerRunner } from "./collectPackageManagerRunner.js";
import { collectReferencedPackageNames } from "./collectReferencedPackageNames.js";
import { filterTypedPackageNames } from "./filterTypedPackageNames.js";

const uniqueBuiltinModules = new Set(builtinModules);

/**
 * Creates a mutations provider that installs missing types modules.
 * @returns Provider to install missing types modules, if needed.
 */
export const installMissingTypes = async (options: TSInitializeOptions) => {
	// Collect package names already present in the package file
	const existingPackageNames = await collectExistingTypingPackages(options);
	if (existingPackageNames === undefined) {
		return;
	}

	// Collect every package name referenced by every file in the project
	const referencedPackageNames = collectReferencedPackageNames(
		options.filePaths,
	);

	// Ignore package names already referenced in package.json or that don't exist in DefinitelyTyped
	const missingPackageNames = setSubtract(
		referencedPackageNames,
		new Set(existingPackageNames),
		uniqueBuiltinModules,
	);
	const missingTypedPackageNames = await filterTypedPackageNames(
		Array.from(missingPackageNames),
	);
	if (missingTypedPackageNames.length === 0) {
		return;
	}

	// Run the installation command using the requested or detected package manager
	const packageManagerRunner = collectPackageManagerRunner(options);
	await packageManagerRunner(options, missingTypedPackageNames);
};
