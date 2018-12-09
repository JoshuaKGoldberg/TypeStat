import { AutoMutator } from "automutate";
import { loadOptions } from "./options/loadOptions";
import { createTypeStatMutationsProvider } from "./runtime/createTypeStatMutationsProvider";

// tslint:disable:no-console

export interface TypeStatOptions {
    /**
     * Path to load configuration options from, if not via a cosmiconfig lookup.
     */
    readonly configPath?: string;
}

export type TypeStatResult = FailedTypeStatResult | SucceededTypeStatResult;

export interface FailedTypeStatResult {
    readonly error: Error;
    readonly succeeded: false;
}

export interface SucceededTypeStatResult {
    readonly succeeded: true;
}

export const typeStat = async ({ configPath }: TypeStatOptions): Promise<TypeStatResult> => {
    try {
        const options = await loadOptions(configPath);
        const automutator = new AutoMutator({
            mutationsProvider: createTypeStatMutationsProvider(options),
        });

        await automutator.run();
    } catch (error) {
        return {
            error: error as Error,
            succeeded: false,
        };
    }

    return {
        succeeded: true,
    };
};
