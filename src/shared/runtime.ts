import { Mutation } from "automutate";

import { MutationsComplaint } from "../mutators/complaint.js";
import { FileMutationsRequest, FileMutator } from "./fileMutator.js";

export const findFirstMutations = (
	request: FileMutationsRequest,
	mutators: readonly [string, FileMutator][],
): MutationsComplaint | readonly Mutation[] | undefined => {
	for (const [mutatorName, mutator] of mutators) {
		try {
			const result = mutator(request);

			if (result instanceof MutationsComplaint) {
				logOutput(request, mutatorName, "found a complaint", result);
				return MutationsComplaint.wrapping(mutatorName, result);
			}

			if (result !== undefined && result.length !== 0) {
				const stats = mutationStats(result);
				logOutput(
					request,
					mutatorName,
					`found ${result.length} mutations${stats}`,
					result,
				);
				return result;
			}
		} catch (error) {
			logOutput(request, mutatorName, "threw an error", error);
			return new MutationsComplaint(error as Error, [mutatorName]);
		}
	}

	return undefined;
};

const logOutput = (
	request: FileMutationsRequest,
	mutatorName: string,
	action: string,
	data: unknown,
) => {
	request.options.output.log?.(
		`${mutatorName} ${action} in ${request.sourceFile.fileName}: ${JSON.stringify(data, null, 4)}`,
	);
};

const mutationStats = (mutations: readonly Mutation[]) => {
	let deletions = 0;
	let insertions = 0;
	let swaps = 0;

	for (const mutation of mutations) {
		if (mutation.type === "text-delete") {
			deletions++;
		} else if (mutation.type === "text-insert") {
			insertions++;
		} else if (mutation.type === "text-swap") {
			swaps++;
		}
		// there is also "multiple" mutation type
	}

	const stats = [
		insertions ? `${insertions} insertions` : undefined,
		deletions ? `${deletions} deletions` : undefined,
		swaps ? `${swaps} swaps` : undefined,
	]
		.filter((x) => !!x)
		.join(", ");
	return stats ? ` (${stats})` : "";
};
