import { MutationsProvider } from "automutate";

import { TypeStatOptions } from "../options/types.js";
import { createProviderFromProviders } from "./createProviderFromProviders.js";
import { createCleanupsProvider } from "./providers/createCleanupsProvider.js";
import { createCoreMutationsProvider } from "./providers/createCoreMutationsProvider.js";
import { createFileRenamesProvider } from "./providers/createFileRenamesProvider/index.js";
import { createInstallMissingTypesProvider } from "./providers/createInstallMissingTypesProvider.js";
import { createMarkFilesModifiedProvider } from "./providers/createMarkFilesModifiedProvider.js";
import { createPostProcessingProvider } from "./providers/createPostProcessingProvider.js";
import { createRequireRenameProvider } from "./providers/createRequireRenameProvider.js";

/**
 * Creates a mutations provider that mutates files, then marks them as mutated.
 */
export const createTypeStatProvider = (
	options: TypeStatOptions,
): MutationsProvider => {
	const allModifiedFiles = new Set<string>();

	return {
		provide: createProviderFromProviders(options, [
			createFileRenamesProvider(allModifiedFiles),
			createInstallMissingTypesProvider(),
			createRequireRenameProvider(allModifiedFiles),
			createCoreMutationsProvider(allModifiedFiles),
			createCleanupsProvider(allModifiedFiles),
			createMarkFilesModifiedProvider(allModifiedFiles),
			createPostProcessingProvider(allModifiedFiles),
		]),
	};
};
