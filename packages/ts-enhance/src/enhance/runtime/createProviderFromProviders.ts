import { MutationsWave } from "automutate";

import { TSEnhanceOptions } from "../../options/types.js";
import { Provider, ProviderCreator } from "./types.js";

/**
 * Creates a provider that runs through a series of providers.
 * @param options   Parsed runtime options for ts-enhance.
 * @param providers   Providers to return changes from, in order.
 * @returns Single provider equivalent to the given providers, in order.
 */
export const createProviderFromProviders = (
	options: TSEnhanceOptions,
	providerCreators: ProviderCreator[],
) => {
	let index = -1;
	let provider: Provider | undefined;

	const multiProvider = async (): Promise<MutationsWave> => {
		if (!provider) {
			for (index += 1; index < providerCreators.length; index += 1) {
				provider = providerCreators[index](options);

				if (provider) {
					break;
				}
			}

			if (!provider) {
				return { fileMutations: undefined };
			}
		}

		const results = await provider();
		if (!results) {
			provider = undefined;
			return multiProvider();
		}

		options = results.newOptions ?? options;

		if (results.mutationsWave?.fileMutations === undefined) {
			return { fileMutations: undefined };
		}

		return results.mutationsWave;
	};

	return multiProvider;
};
