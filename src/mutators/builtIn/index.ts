import { FileMutator } from "../fileMutator";

import { fixIncompleteTypes } from "./fixIncompleteTypes";
import { fixMissingProperties } from "./fixMissingProperties";
import { fixNoImplicitAny } from "./fixNoImplicitAny";
import { fixStrictNonNullAssertions } from "./fixStrictNonNullAssertions";

export const builtInFileMutators: readonly [string, FileMutator][] = [
    ["fixIncompleteTypes", fixIncompleteTypes],
    ["fixMissingProperties", fixMissingProperties],
    ["fixNoImplicitAny", fixNoImplicitAny],
    ["fixStrictNonNullAssertions", fixStrictNonNullAssertions],
];
