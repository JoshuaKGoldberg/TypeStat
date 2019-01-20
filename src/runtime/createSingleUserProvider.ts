import { IMutationsWave } from "automutate";

/**
 * Creates a provider that will run exactly once.
 *
 * @param provider   Provider to wrap around.
 * @returns Single-use equivalent of the provider.
 */
export const createSingleUseProvider = (provider: () => Promise<IMutationsWave>) => {
    let provided = false;

    return async (): Promise<IMutationsWave> => {
        if (provided) {
            return {
                fileMutations: undefined,
            };
        }

        provided = true;

        return provider();
    };
};
