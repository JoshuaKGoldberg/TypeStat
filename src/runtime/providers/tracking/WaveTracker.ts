import { Mutation } from "automutate";
import { Dictionary } from "../../../shared/maps";

const createHash = (fileMutations: Dictionary<readonly Mutation[]>) => Object.keys(fileMutations).join(",");

/**
 * How many waves in a row must be duplicates of previously seen waves to halt.
 */
const threshold = 25;

export class WaveTracker {
    /**
     * How many times each wave file names hash has been seen.
     */
    #previouslySeen = new Set<string>();

    /**
     * How many waves in a row have now had repetitions greater than the duplicate threshold.
     */
    #repeatedCount = 0;

    /**
     * @param fileMutations A newly created wave of mutations.
     * @returns Whether the wave has reached the duplicate threshold.
     */
    addAndCheck(fileMutations: Dictionary<readonly Mutation[]>) {
        const hash = createHash(fileMutations);
        const previouslySeen = this.#previouslySeen.has(hash);

        this.#previouslySeen.add(hash);

        if (!previouslySeen) {
            this.#repeatedCount = 0;
            return false;
        }

        this.#repeatedCount += 1;
        return this.#repeatedCount === threshold;
    }
}
