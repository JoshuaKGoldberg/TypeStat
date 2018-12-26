import { IMutation } from "automutate";
import chalk from "chalk";
import { readline } from "mz";

import { builtInFileMutators } from "../mutators/builtInFileMutators";
import { FileMutationsRequest, FileMutator } from "../mutators/fileMutator";

/**
 * Collects all mutations that should apply to a file.
 */
export const findMutationsInFile = async (request: FileMutationsRequest): Promise<ReadonlyArray<IMutation> | undefined> => {
    const checkMessage = chalk.grey(`Checking ${chalk.bold(request.sourceFile.fileName)}...`);
    request.options.logger.stdout.write(`${checkMessage}\n`);
    let mutations: ReadonlyArray<IMutation> | undefined;

    for (const [mutatorName, mutator] of collectFileMutators(request.options.mutators)) {
        try {
            const addedMutations = mutator(request);

            if (addedMutations.length !== 0) {
                mutations = addedMutations;
                break;
            }
        } catch (error) {
            request.options.logger.stderr.write(
                `\nError in ${request.sourceFile.fileName} with ${mutatorName}: ${(error as Error).stack}\n\n\n`,
            );
        }
    }

    readline.moveCursor(request.options.logger.stdout, -checkMessage.length, -1);
    readline.clearLine(request.options.logger.stdout, 1);
    return mutations;
};

const collectFileMutators = (addedMutators: ReadonlyArray<[string, FileMutator]>): ReadonlyArray<[string, FileMutator]> =>
    addedMutators.length === 0 ? builtInFileMutators : addedMutators;
