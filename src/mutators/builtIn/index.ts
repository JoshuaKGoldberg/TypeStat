import { FileMutator } from "../fileMutator";

import { fixIncompleteTypes } from "./fixIncompleteTypes";
import { fixMissingProperties } from "./fixMissingProperties";
import { fixNoImplicitAny } from "./fixNoImplicitAny";
import { fixNoInferableTypes } from "./fixNoInferableTypes";
import { fixStrictNonNullAssertions } from "./fixStrictNonNullAssertions";

export const builtInFileMutators: ReadonlyArray<[string, FileMutator]> = [
    ["fixIncompleteTypes", fixIncompleteTypes],
    ["fixMissingProperties", fixMissingProperties],
    ["fixNoImplicitAny", fixNoImplicitAny],
    ["fixNoInferableTypes", fixNoInferableTypes],
    ["fixStrictNonNullAssertions", fixStrictNonNullAssertions],
];
