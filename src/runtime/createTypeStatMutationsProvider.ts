import { IMutationsProvider } from "automutate";

import { TypeStatOptions } from "../options/types";
import { createProviderFromProviders } from "./createProviderFromProviders";
import { createCoreMutationsProvider } from "./providers/createCoreMutationsProvider";
import { createMarkFilesModifiedProvider } from "./providers/createMarkFilesModifiedProvider";
import { createRequireRenameProvider } from "./providers/createRequireRenameProvider";

/**
 * Creates a mutations provider that mutates files, then marks them as mutated.
 */
export const createTypeStatMutationsProvider = (options: TypeStatOptions): IMutationsProvider => {
    const allModifiedFiles = new Set<string>();

    return {
        provide: createProviderFromProviders(
            createRequireRenameProvider(options, allModifiedFiles),
            createCoreMutationsProvider(options, allModifiedFiles),
            createMarkFilesModifiedProvider(options, allModifiedFiles),
        ),
    };
};
