import { runMutations } from "automutate";

import { loadOptions } from "./options/loadOptions";
import { TypeStatOptions } from "./options/types";
import { createTypeStatMutationsProvider } from "./runtime/createTypeStatMutationsProvider";

// tslint:disable:no-console

/**
 * Node arguments to pass to TypeStat.
 */
export interface TypeStatArgv {
    readonly args?: ReadonlyArray<string>;
    readonly config?: string;
    readonly filters?: ReadonlyArray<string>;
    readonly fixIncompleteTypes?: boolean;
    readonly fixMissingProperties?: boolean;
    readonly fixNoImplicitAny?: boolean;
    readonly fixNoImplicitThis?: boolean;
    readonly fixStrictNullChecks?: boolean;
    readonly mutators?: string | ReadonlyArray<string>;
    readonly project?: string;
    readonly typesOnlyPrimitives?: boolean;
    readonly typesMatching?: ReadonlyArray<string>;
}

export enum ResultStatus {
    ConfigurationError,
    Failed,
    Succeeded,
}

export type TypeStatResult = ConfigurationErrorResult | FailedResult | SucceededResult;

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

export const typeStat = async (argv: TypeStatArgv): Promise<TypeStatResult> => {
    const options = await tryLoadingOptions(argv);
    if (options === undefined || options instanceof Error) {
        return {
            error:
                options === undefined
                    ? "No fixes or custom mutators specified. Consider enabling --fixNoImplicitAny (see http://github.com/joshuakgoldberg/typestat#cli)."
                    : options,
            status: ResultStatus.ConfigurationError,
        };
    }

    try {
        await runMutations({
            mutationsProvider: createTypeStatMutationsProvider(options),
        });
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

const tryLoadingOptions = async (argv: TypeStatArgv): Promise<TypeStatOptions | Error | undefined> => {
    try {
        return loadOptions(argv);
    } catch (error) {
        return error instanceof Error ? error : new Error(error as string);
    }
};
