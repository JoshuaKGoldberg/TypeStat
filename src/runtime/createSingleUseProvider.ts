import chalk from "chalk";
import { EOL } from "os";

import { TypeStatOptions } from "../options/types";
import { ProvidedMutationsWave, Provider, ProviderCreator } from "./types";

/**
 * Creates a provider that will run exactly once.
 *
 * @param message   Message to log before and after running.
 * @param provider   Provider to wrap around.
 * @returns Single-use equivalent of the provider.
 */
export const createSingleUseProvider = (message: string, providerCreator: ProviderCreator) => {
    return (options: TypeStatOptions): Provider | undefined => {
        const provider = providerCreator(options);
        if (!provider) {
            return undefined;
        }

        let provided = false;

        return async (): Promise<ProvidedMutationsWave | undefined> => {
            if (provided) {
                return undefined;
            }

            options.output.stdout(chalk.blue(`${message}...`));
            const result = await provider();
            options.output.stdout(chalk.blueBright(`Done.${EOL}`));

            provided = true;
            return result;
        };
    };
};
