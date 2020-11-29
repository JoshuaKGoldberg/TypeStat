import { IMutation } from "automutate";
import chalk from "chalk";
import { EOL } from "os";

import { MutationsComplaint } from "../mutators/complaint";
import { FileMutationsRequest } from "../mutators/fileMutator";
import { findFirstMutations } from "../shared/runtime";

/**
 * Collects all mutations that should apply to a file.
 */
export const findMutationsInFile = async (request: FileMutationsRequest): Promise<ReadonlyArray<IMutation> | undefined> => {
    const checkMessage = chalk.grey(`Checking ${chalk.bold(request.sourceFile.fileName)}...`);
    request.options.output.stdout(checkMessage);

    let mutations = findFirstMutations(request, request.options.mutators);
    if (mutations instanceof MutationsComplaint) {
        request.options.output.stderr(
            `${EOL}Error in ${request.sourceFile.fileName} with ${mutations.mutatorPath.join(" > ")}: ${mutations.error.stack}${EOL}${EOL}`,
        );

        mutations = undefined;
    }

    return mutations;
};
