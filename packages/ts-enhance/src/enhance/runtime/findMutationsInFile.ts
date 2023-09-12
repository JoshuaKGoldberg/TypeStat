import { Mutation } from "automutate";
import { EOL } from "node:os";

import { MutationsComplaint } from "../../mutators/complaint.js";
import { FileMutationsRequest, FileMutator } from "../../shared/fileMutator.js";
import { findFirstMutations } from "../../shared/runtime.js";

/**
 * Collects all mutations that should apply to a file.
 */
export const findMutationsInFile = (
	request: FileMutationsRequest,
	mutators: readonly [string, FileMutator][],
): readonly Mutation[] | undefined => {
	let mutations = findFirstMutations(request, mutators);
	if (mutations instanceof MutationsComplaint) {
		request.options.output.stderr(
			`${EOL}Error in ${
				request.sourceFile.fileName
			} with ${mutations.mutatorPath.join(" > ")}: ${
				mutations.error.stack
			}${EOL}${EOL}`,
		);

		mutations = undefined;
	}

	return mutations;
};
