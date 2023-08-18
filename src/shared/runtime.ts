import { Mutation } from "automutate";

import { MutationsComplaint } from "../mutators/complaint";
import { FileMutationsRequest, FileMutator } from "./fileMutator";

export const findFirstMutations = (
    request: FileMutationsRequest,
    mutators: readonly [string, FileMutator][],
): readonly Mutation[] | MutationsComplaint | undefined => {
    for (const [mutatorName, mutator] of mutators) {
        try {
            const result = mutator(request);

            if (result instanceof MutationsComplaint) {
                logOutput(request, mutatorName, "found a complaint", result);
                return MutationsComplaint.wrapping(mutatorName, result);
            }

            if (result !== undefined && result.length !== 0) {
                logOutput(request, mutatorName, "found mutations", result);
                return result;
            }
        } catch (error) {
            logOutput(request, mutatorName, "threw an error", error);
            return new MutationsComplaint(error as Error, [mutatorName]);
        }
    }

    return undefined;
};

const logOutput = (request: FileMutationsRequest, mutatorName: string, action: string, data: unknown) => {
    request.options.output.log?.(
        [mutatorName, ` ${action} in `, request.sourceFile.fileName, ": ", JSON.stringify(data, null, 4)].join(""),
    );
};
