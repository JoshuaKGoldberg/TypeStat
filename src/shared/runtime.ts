import { IMutation } from "automutate";

import { MutationsComplaint } from "../mutators/complaint";
import { FileMutationsRequest, FileMutator } from "../mutators/fileMutator";

export const findFirstMutations = (
    request: FileMutationsRequest,
    mutators: ReadonlyArray<[string, FileMutator]>,
): ReadonlyArray<IMutation> | MutationsComplaint | undefined => {
    for (const [mutatorName, mutator] of mutators) {
        try {
            const result = mutator(request);

            if (result instanceof MutationsComplaint) {
                return MutationsComplaint.wrapping(mutatorName, result);
            }

            if (result !== undefined && result.length !== 0) {
                return result;
            }
        } catch (error) {
            return new MutationsComplaint(error as Error, [mutatorName]);
        }
    }

    return undefined;
};
