// Ensure TypeScript is exposed before any files import it
// tslint:disable-next-line
require("./mutations/createExposedTypeScript").requireExposedTypeScript();

import { runMutations } from "automutate";

import { ProcessLogger } from "./logging/logger";
import { loadOptions } from "./options/loadOptions";
import { findComplaintForOptions } from "./options/optionVerification";
import { processFileRenames } from "./options/processFileRenames";
import { TypeStatOptions } from "./options/types";
import { createTypeStatProvider } from "./runtime/createTypeStatProvider";

/**
 * Root arguments to pass to TypeStat.
 */
export interface TypeStatArgv {
    readonly args?: ReadonlyArray<string>;
    readonly config?: string;
    readonly fileAbove?: string;
    readonly fileBelow?: string;
    readonly fileRenameExtensions?: boolean | "ts" | "tsx";
    readonly filter?: string | ReadonlyArray<string>;
    readonly fixIncompleteTypes?: boolean;
    readonly fixMissingProperties?: boolean;
    readonly fixNoImplicitAny?: boolean;
    readonly fixStrictNonNullAssertions?: boolean;
    readonly mutator?: string | ReadonlyArray<string>;

    /**
     * Wraps process.stderr and process.stdout.
     */
    readonly logger: ProcessLogger;

    readonly packageDirectory?: string;
    readonly packageFile?: string;
    readonly packageMissingTypes?: true | "npm" | "yarn";
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
    const options = await tryLoadingOptions(argv);
    if (options instanceof Error || typeof options === "string") {
        return {
            error: options,
            status: ResultStatus.ConfigurationError,
        };
    }

    try {
        await runMutations({
            mutationsProvider: createTypeStatProvider(options),
        });
    } catch (error) {
        console.log("Caught index typeStat", { error });
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

    // First try loading options from the CLI and/or config file
    try {
        options = await loadOptions(argv);
    } catch (error) {
        console.log("Caught index tryLoadingOptions", { options });
        return error instanceof Error ? error : new Error(error as string);
    }

    // If that succeeded, run any file renames needed as part of project setup
    if (typeof options !== "string") {
        options = await processFileRenames(options);
    }

    const optionsComplaint = findComplaintForOptions(options);

    return optionsComplaint === undefined ? options : optionsComplaint;
};
