import { AutoMutator } from "automutate";
import { ParsedCliArgv } from "./cli";
import { loadOptions } from "./options/loadOptions";
import { TypeStatOptions } from "./options/types";
import { createTypeStatMutationsProvider } from "./runtime/createTypeStatMutationsProvider";

// tslint:disable:no-console

export enum ResultStatus {
    ConfigurationError,
    Failed,
    Succeeded,
}

export type TypeStatResult = (
    | ConfigurationErrorResult
    | FailedResult
    | SucceededResult
);

export interface ConfigurationErrorResult {
    readonly error: Error | string;
    readonly status: ResultStatus.ConfigurationError;
}

export interface FailedResult {
    readonly error: Error | string;
    readonly status: ResultStatus.Failed;
}

export interface SucceededResult {
    readonly status: ResultStatus.Succeeded;
}

export const typeStat = async (argv: ParsedCliArgv): Promise<TypeStatResult> => {
    const options = await tryLoadingOptions(argv);
    if (options === undefined || options instanceof Error) {
        return {
            error: options === undefined
                ? "No fixes specified. Consider enabling --fixNoImplicitAny (see http://github.com/joshuakgoldberg/typestat#cli)."
                : options,
            status: ResultStatus.ConfigurationError,
        };
    }

    try {
        const automutator = new AutoMutator({
            mutationsProvider: createTypeStatMutationsProvider(options),
        });

        await automutator.run();
    } catch (error) {
        return {
            error: error as Error,
            status: ResultStatus.Failed,
        };
    }

    return {
        status: ResultStatus.Succeeded,
    };
};

const tryLoadingOptions = async (argv: ParsedCliArgv): Promise<TypeStatOptions | Error | undefined> => {
    try {
        return loadOptions(argv);
    } catch (error) {
        return error;
    }
};
