import * as path from "path";

import { Logger } from "../logging/logger";
import { FileMutator } from "../mutators/fileMutator";
import { RawTypeStatOptions } from "./types";

interface ImportedFileMutator {
    fileMutator: FileMutator;
}

/**
 * 
 * @param rawOptions 
 */
export const collectAddedMutators = (rawOptions: RawTypeStatOptions, logger: Logger): ReadonlyArray<[string, FileMutator]> => {
    if (rawOptions.addedMutators === undefined) {
        return [];
    }

    const additions: [string, FileMutator][] = [];
    const baseOptionsDir = rawOptions.projectPath === undefined
        ? process.cwd()
        : path.basename(rawOptions.projectPath);

    for (const rawAddedMutator of rawOptions.addedMutators) {
        try {
            const addedMutator = collectedAddedMutator(baseOptionsDir, rawAddedMutator, logger);

            if (addedMutator !== undefined) {
                additions.push([rawAddedMutator, addedMutator]);
            }
        } catch (error) {
            logger.stderr.write(`Could not require ${rawAddedMutator} from ${baseOptionsDir}.`);
            logger.stderr.write(error instanceof Error ? error.stack : error);
        }
    }

    return additions;
};

const collectedAddedMutator = (baseOptionsDir: string, rawAddedMutator: string, logger: Logger): FileMutator | undefined => {
    const requiringPath = path.join(baseOptionsDir, rawAddedMutator);
    const resolvedImport = require.resolve(requiringPath);

    if (resolvedImport === undefined) {
        logger.stderr.write(`Could not require ${rawAddedMutator} from ${baseOptionsDir}.`);
        logger.stderr.write("It doesn't seem to exist? :(");
        return undefined;
    }
    const result: Partial<ImportedFileMutator> = require(requiringPath);

    if (typeof result.fileMutator !== "function") {
        logger.stderr.write(`Could not require ${rawAddedMutator} from ${baseOptionsDir}.`);

        if (result.fileMutator === undefined) {
            logger.stderr.write(`It doesn't have an exported .fileMutator, which must a function.`);
        } else {
            logger.stderr.write(`Its exported .fixer is ${typeof result.fileMutator} intead of function.`);
        }

        return undefined;
    }

    return result.fileMutator;
};
