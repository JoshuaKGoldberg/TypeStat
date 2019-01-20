import { IMutationsWave } from "automutate";

/**
 * Creates a provider that runs through a series of providers.
 *
 * @param providers   Providers to return changes from, in order.
 * @returns Single provider equivalent to the given providers, in order.
 */
export const createProviderFromProviders = (...providers: (() => Promise<IMutationsWave>)[]) => {
    let index = 0;

    const multiProvider = async (): Promise<IMutationsWave> => {
        if (index === providers.length) {
            return {
                fileMutations: undefined,
            };
        }

        const results = await providers[index]();

        if (results.fileMutations === undefined) {
            index += 1;
            return multiProvider();
        }

        return results;
    };

    return multiProvider;
};
