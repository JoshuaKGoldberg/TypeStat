import { MutationsProvider } from "automutate";

import { TSEnhanceOptions } from "../../options/types.js";
import { createProviderFromProviders } from "./createProviderFromProviders.js";
import { createCleanupsProvider } from "./providers/createCleanupsProvider.js";
import { createCoreMutationsProvider } from "./providers/createCoreMutationsProvider.js";
import { createMarkFilesModifiedProvider } from "./providers/createMarkFilesModifiedProvider.js";
import { createPostProcessingProvider } from "./providers/createPostProcessingProvider.js";

/**
 * Creates a mutations provider that mutates files, then marks them as mutated.
 */
export const createTSEnhanceProvider = (
	options: TSEnhanceOptions,
): MutationsProvider => {
	const allModifiedFiles = new Set<string>();

	return {
		provide: createProviderFromProviders(options, [
			createCoreMutationsProvider(allModifiedFiles),
			createCleanupsProvider(allModifiedFiles),
			createMarkFilesModifiedProvider(allModifiedFiles),
			createPostProcessingProvider(allModifiedFiles),
		]),
	};
};
