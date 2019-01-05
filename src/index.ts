import { runMutations } from "automutate";

import { ProcessLogger } from "./logging/logger";
import { loadOptions } from "./options/loadOptions";
import { findComplaintForOptions } from "./options/optionVerification";
import { TypeStatOptions } from "./options/types";
import { createTypeStatMutationsProvider } from "./runtime/createTypeStatMutationsProvider";

/**
 * Root arguments to pass to TypeStat.
 */
export interface TypeStatArgv {
    readonly args?: ReadonlyArray<string>;
    readonly config?: string;
    readonly filter?: string | ReadonlyArray<string>;
    readonly fixIncompleteTypes?: boolean;
    readonly fixMissingProperties?: boolean;
    readonly fixNoImplicitAny?: boolean;
    readonly fixNoImplicitThis?: boolean;
    readonly fixStrictNonNullAssertions?: boolean;
    readonly mutator?: string | ReadonlyArray<string>;

    /**
     * Wraps process.stderr and process.stdout.
     */
    readonly logger: ProcessLogger;

    readonly project?: string;
    readonly typeAlias?: string | ReadonlyArray<string>;
    readonly typeMatching?: ReadonlyArray<string>;
    readonly typeOnlyPrimitives?: boolean;
    readonly typeStrictNullChecks?: boolean;
}

export enum ResultStatus {
    Succeeded = 0,
    Failed = 1,
    ConfigurationError = 2,
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
    console.log({ argv });
    const options = await tryLoadingOptions(argv);
    console.log({ options });
    if (options instanceof Error || typeof options === "string") {
        return {
            error: options,
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

const tryLoadingOptions = async (argv: TypeStatArgv): Promise<TypeStatOptions | Error | string> => {
    let options: TypeStatOptions | string;

    try {
        options = await loadOptions(argv);
    } catch (error) {
        return error instanceof Error ? error : new Error(error as string);
    }

    const optionsComplaint = findComplaintForOptions(options);

    return optionsComplaint === undefined ? options : optionsComplaint;
};
