// Ensure TypeScript is exposed before any files import it
require("./mutations/createExposedTypeScript").requireExposedTypeScript();

import { runMutations } from "automutate";
import { collectFileNames } from "./collectFileNames";

import { loadPendingOptions } from "./options/loadPendingOptions";
import { processFileRenames } from "./options/processFileRenames";
import { PendingTypeStatOptions } from "./options/types";
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
    const allPendingOptions = await tryLoadingPendingOptions(argv, output);
    if (allPendingOptions instanceof Error || typeof allPendingOptions === "string") {
        return {
            error: allPendingOptions,
            status: ResultStatus.ConfigurationError,
        };
    }
    for (let i = 0; i < allPendingOptions.length; i += 1) {
        function createFailure(message: string): TypeStatResult {
            return {
                error: new Error(`Could not run options at index ${i}: ${message}`),
                status: ResultStatus.Failed,
            };
        }

        // Collect all files to be run on this option iteration from the include glob(s)
        const fileNames = await collectFileNames(argv, process.cwd(), allPendingOptions[i].include);
        if (!fileNames) {
            continue;
        }
        if (typeof fileNames === "string") {
            return createFailure(fileNames);
        }

        // Run any any file renames needed as part of project setup
        const options = await processFileRenames(fileNames, allPendingOptions[i]);
        if (typeof options === "string") {
            return createFailure(options);
        }

        // Finally run the actual core TypeStat mutation logic
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

const tryLoadingPendingOptions = async (argv: TypeStatArgv, output: ProcessOutput): Promise<PendingTypeStatOptions[] | Error | string> => {
    try {
        return await loadPendingOptions(argv, output);
    } catch (error) {
        return error instanceof Error ? error : new Error(error as string);
    }
};
