import { ProcessOutput } from "typestat-utils";

/**
 * Root arguments to pass to the main runners.
 */
export interface TSEnhanceArgv {
	config?: string;
	cwd: string;
	output: ProcessOutput;
	project: string;
	version: boolean;
}

/**
 * Root arguments with a provided config.
 */
export type RunEnhanceArgv = TSEnhanceArgv & {
	config: string;
};

export enum ResultStatus {
	ConfigurationError = 2,
	Failed = 1,
	Succeeded = 0,
}

export type TSEnhanceResult =
	| ConfigurationErrorResult
	| FailedResult
	| SucceededResult;

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
