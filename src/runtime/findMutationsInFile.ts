import { IMutation } from "automutate";
import chalk from "chalk";

import { defaultFileMutators } from "../mutators/defaultFileMutators";
import { FileMutationsRequest } from "../mutators/fileMutator";

/**
 * Collects all mutations that should apply to a file.
 */
export const findMutationsInFile = async (request: FileMutationsRequest): Promise<ReadonlyArray<IMutation>> => {
    request.options.logger.stdout(chalk.grey(`Checking ${chalk.bold(request.sourceFile.fileName)}...`));
    let mutations: ReadonlyArray<IMutation> | undefined;

    for (const [mutatorName, mutator] of defaultFileMutators) {
        try {
            const addedMutations = mutator(request);

            if (addedMutations.length !== 0) {
                mutations = addedMutations;
                break;
            }
        } catch (error) {
            request.options.logger.stderr(`\nError in ${request.sourceFile.fileName} with ${mutatorName}: ${(error as Error).stack}\n`);
        }
    }

    if (mutations === undefined) {
        request.options.logger.stdout(chalk.grey(" nothing going.\n"));
        return [];
    }

    request.options.logger.stdout(` ${chalk.green(`${mutations.length}`)} found.\n`);
    return mutations;
};
