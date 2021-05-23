// Ensure TypeScript is exposed before any files import it
require("./mutations/createExposedTypeScript").requireExposedTypeScript();

import { runMutations } from "automutate";

import { loadOptions } from "./options/loadOptions";
import { processFileRenames } from "./options/processFileRenames";
import { TypeStatOptions } from "./options/types";
import { ProcessOutput } from "./output";
import { createTypeStatProvider } from "./runtime/createTypeStatProvider";

/**
 * Root arguments to pass to TypeStat.
 */
export interface TypeStatArgv {
    args: readonly string[];
    config?: string;
    logfile?: string;
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

export const typeStat = async (argv: TypeStatArgv, output: ProcessOutput): Promise<TypeStatResult> => {
    const allOptions = await tryLoadingOptions(argv, output);
    if (allOptions instanceof Error || typeof allOptions === "string") {
        return {
            error: allOptions,
            status: ResultStatus.ConfigurationError,
        };
    }
    
    for (let i = 0; i < allOptions.length; i += 1) {
        // First run any any file renames needed as part of project setup
        const options = await processFileRenames(allOptions[i]);
        if (typeof options === "string") {
            return {
                error: new Error(`Could not run options at index ${i}: ${options}`),
                status: ResultStatus.Failed,
            };
        }

        // Next run the actual core TypeStat mutation logic
        try {
            await runMutations({
                mutationsProvider: createTypeStatProvider(options),
            });
        } catch (error) {
            return {
                error: error as Error,
                status: ResultStatus.Failed,
            };
        }
    }

    return {
        status: ResultStatus.Succeeded,
    };
};

const tryLoadingOptions = async (argv: TypeStatArgv, output: ProcessOutput): Promise<TypeStatOptions[] | Error | string> => {
    try {
        return await loadOptions(argv, output);
    } catch (error) {
        return error instanceof Error ? error : new Error(error as string);
    }
};
