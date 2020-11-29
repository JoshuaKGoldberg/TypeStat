import * as path from "path";

import { ProcessOutput } from "../../output";
import { builtInFileMutators } from "../../mutators/builtIn";
import { FileMutator } from "../../mutators/fileMutator";
import { collectOptionals } from "../../shared/arrays";
import { getQuickErrorSummary } from "../../shared/errors";
import { RawTypeStatOptions } from "../types";

interface ImportedFileMutator {
    fileMutator: FileMutator;
}

/**
 * Finds mutators to use in runtime, as either the built-in mutators or custom mutators specified by the user.
 *
 * @param rawOptions   Options listed as JSON in a typestat configuration file.
 * @param packageDirectory   Base directory to resolve paths from.
 * @param output   Wraps process.stderr and process.stdout.
 * @returns Mutators to run with their friendly names.
 */
export const collectAddedMutators = (
    rawOptions: RawTypeStatOptions,
    packageDirectory: string,
    output: ProcessOutput,
): ReadonlyArray<[string, FileMutator]> => {
    const addedMutators = collectOptionals(rawOptions.mutators);
    if (addedMutators.length === 0) {
        return builtInFileMutators;
    }

    const additions: [string, FileMutator][] = [];
    for (const rawAddedMutator of addedMutators) {
        try {
            const addedMutator = collectAddedMutator(packageDirectory, rawAddedMutator, output);

            if (addedMutator !== undefined) {
                additions.push([rawAddedMutator, addedMutator]);
            }
        } catch (error) {
            output.stderr(`Could not require ${rawAddedMutator} from ${packageDirectory}.`);
            output.stderr(getQuickErrorSummary(error));
        }
    }

    return additions;
};

const collectAddedMutator = (packageDirectory: string, rawAddedMutator: string, output: ProcessOutput): FileMutator | undefined => {
    const requiringPath = path.join(packageDirectory, rawAddedMutator);
    const resolvedImport = tryRequireResolve(requiringPath);
    if (resolvedImport === undefined) {
        output.stderr(`Could not require ${rawAddedMutator} at ${requiringPath} from ${packageDirectory}.`);
        output.stderr("It doesn't seem to exist? :(");
        return undefined;
    }

    const result = require(requiringPath) as Partial<ImportedFileMutator>;

    if (typeof result.fileMutator !== "function") {
        output.stderr(`Could not require ${rawAddedMutator} from ${packageDirectory}.`);

        if (result.fileMutator === undefined) {
            output.stderr(`It doesn't have an exported .fileMutator, which must be a function.`);
        } else {
            output.stderr(`Its exported .fileMutator is ${typeof result.fileMutator} intead of function.`);
        }

        return undefined;
    }

    return result.fileMutator;
};

const tryRequireResolve = (requiringPath: string): string | undefined => {
    try {
        return require.resolve(requiringPath);
    } catch (error) {
        return undefined;
    }
};
