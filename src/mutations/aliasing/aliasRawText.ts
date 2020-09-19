import * as ts from "typescript";
import { FileMutationsRequest } from "../../mutators/fileMutator";

/**
 * Aliases types within text suggested by TypeScript, if deemed necessary.
 */
export const aliasRawText = (request: FileMutationsRequest, rawText: string) => {
    // We really only care about type inferences that add in a type annotation
    if (!rawText.startsWith(":")) {
        return undefined;
    }

    const afterColon = rawText.slice(1).trim();

    // TODO: at this point we (most of the time) have a type that can be added after a ": ".
    // We should now parse it into a ts.SourceFile and run a traversal through that node tree,
    // applying removals and aliases/renames as we get to identifiers.
};
