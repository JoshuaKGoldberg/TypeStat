import { IMutation } from "automutate";
import chalk from "chalk";

import { defaultFileMutators } from "../mutators/defaultFileMutators";
import { FileMutationsRequest } from "./mutator";

/**
 * Collects all mutations that should apply to a file.
 */
export const findMutationsInFile = async (request: FileMutationsRequest): Promise<ReadonlyArray<IMutation>> => {
    request.options.logger.write(chalk.grey(`Checking ${chalk.bold(request.sourceFile.fileName)}...`));
    let mutations: ReadonlyArray<IMutation> | undefined;

    for (const mutator of defaultFileMutators) {
        const addedMutations = mutator(request);

        if (addedMutations.length !== 0) {
            mutations = addedMutations;
            break;
        }
    }

    if (mutations === undefined) {
        request.options.logger.write(chalk.grey(" nothing going.\n"));
        return [];
    }

    request.options.logger.write(` ${chalk.green(`${mutations.length}`)} found.\n`);
    return mutations;
};
