import { MutationsWave } from "automutate";

/**
 * Creates a provider that will run exactly once.
 *
 * @param provider   Provider to wrap around.
 * @returns Single-use equivalent of the provider.
 */
export const createSingleUseProvider = (provider: () => Promise<MutationsWave>) => {
    let provided = false;

    return async (): Promise<MutationsWave> => {
        if (provided) {
            return {
                fileMutations: undefined,
            };
        }

        provided = true;

        return provider();
    };
};
