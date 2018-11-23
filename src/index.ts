import { AutoMutator } from "automutate";
import { loadOptions } from "./options/parsing";
import { createTypeUpMutationsProvider } from "./runtime/createTypeUpMutationsProvider";

// tslint:disable:no-console

export interface TypeUpOptions {
    /**
     * Path to load configuration options from, if not via a cosmiconfig lookup.
     */
    readonly configPath?: string;
}

export type TypeUpResult = FailedTypeUpResult | SucceededTypeUpResult;

export interface FailedTypeUpResult {
    readonly error: Error;
    readonly succeeded: false;
}

export interface SucceededTypeUpResult {
    readonly succeeded: true;
}

export const typeUp = async ({ configPath }: TypeUpOptions): Promise<TypeUpResult> => {
    try {
        const options = await loadOptions(configPath);
        const automutator = new AutoMutator({
            mutationsProvider: createTypeUpMutationsProvider(options),
        });

        await automutator.run();
    } catch (error) {
        console.error(error);

        return {
            error: error as Error,
            succeeded: false,
        };
    }

    return {
        succeeded: true,
    };
};
