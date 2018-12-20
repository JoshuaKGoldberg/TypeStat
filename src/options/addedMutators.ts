import * as path from "path";

import { TypeStatArgv } from "../index";
import { Logger } from "../logging/logger";
import { FileMutator } from "../mutators/fileMutator";
import { arrayify } from "../shared/arrays";
import { getQuickErrorSummary } from "../shared/errors";
import { RawTypeStatOptions } from "./types";

interface ImportedFileMutator {
    fileMutator: FileMutator;
}

/**
 * Finds any added mutators to be imported via require() calls.
 *
 * @param argv   Node arguments to pass to TypeStat.
 * @param rawOptions   Options listed as JSON in a typestat configuration file.
 * @param logger   Wraps process.stderr and process.stdout.
 * @returns Imported mutators with their friendly names.
 */
export const collectAddedMutators = (
    argv: TypeStatArgv,
    rawOptions: RawTypeStatOptions,
    logger: Logger,
): ReadonlyArray<[string, FileMutator]> => {
    const addedMutators = arrayify(argv.mutators);

    if (rawOptions.mutators !== undefined) {
        addedMutators.push(...rawOptions.mutators);
    }

    if (addedMutators.length === 0) {
        return [];
    }

    const additions: [string, FileMutator][] = [];
    const baseOptionsDir = rawOptions.projectPath === undefined ? process.cwd() : path.dirname(rawOptions.projectPath);

    for (const rawAddedMutator of addedMutators) {
        try {
            const addedMutator = collectedAddedMutator(baseOptionsDir, rawAddedMutator, logger);

            if (addedMutator !== undefined) {
                additions.push([rawAddedMutator, addedMutator]);
            }
        } catch (error) {
            logger.stderr.write(`Could not require ${rawAddedMutator} from ${baseOptionsDir}.\n`);
            logger.stderr.write(getQuickErrorSummary(error));
        }
    }

    return additions;
};

const collectedAddedMutator = (baseOptionsDir: string, rawAddedMutator: string, logger: Logger): FileMutator | undefined => {
    const requiringPath = path.join(baseOptionsDir, rawAddedMutator);
    const resolvedImport = tryRequireResolve(requiringPath);
    if (resolvedImport === undefined) {
        logger.stderr.write(`Could not require ${rawAddedMutator} from ${baseOptionsDir}.\n`);
        logger.stderr.write("It doesn't seem to exist? :(\n");
        return undefined;
    }

    const result = require(requiringPath) as Partial<ImportedFileMutator>;

    if (typeof result.fileMutator !== "function") {
        logger.stderr.write(`Could not require ${rawAddedMutator} from ${baseOptionsDir}.\n`);

        // tslint:disable-next-line:strict-type-predicates
        if (result.fileMutator === undefined) {
            logger.stderr.write(`It doesn't have an exported .fileMutator, which must be a function.\n`);
        } else {
            logger.stderr.write(`Its exported .fileMutator is ${typeof result.fileMutator} intead of function.\n`);
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
