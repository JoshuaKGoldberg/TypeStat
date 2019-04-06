import { IMutation } from "automutate";
import chalk from "chalk";
import { readline } from "mz";

import { MutationsComplaint } from "../mutators/complaint";
import { FileMutationsRequest } from "../mutators/fileMutator";
import { findFirstMutations } from "../shared/runtime";

/**
 * Collects all mutations that should apply to a file.
 */
export const findMutationsInFile = async (request: FileMutationsRequest): Promise<ReadonlyArray<IMutation> | undefined> => {
    const checkMessage = chalk.grey(`Checking ${chalk.bold(request.sourceFile.fileName)}...`);
    request.options.logger.stdout.write(`${checkMessage}\n`);

    let mutations = findFirstMutations(request, request.options.mutators);
    if (mutations instanceof MutationsComplaint) {
        request.options.logger.stderr.write(
            `\nError in ${request.sourceFile.fileName} with ${mutations.mutatorPath.join(" > ")}: ${mutations.error.stack}\n\n\n`,
        );

        mutations = undefined;
    }

    readline.moveCursor(request.options.logger.stdout, -checkMessage.length, -1);
    readline.clearLine(request.options.logger.stdout, 1);

    return mutations;
};
