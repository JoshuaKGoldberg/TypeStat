import { FileMutator } from "../../shared/fileMutator";

import { fixImportExtensions } from "./fixImportExtensions";
import { fixIncompleteTypes } from "./fixIncompleteTypes";
import { fixMissingProperties } from "./fixMissingProperties";
import { fixNoImplicitAny } from "./fixNoImplicitAny";
import { fixNoImplicitThis } from "./fixNoImplicitThis";
import { fixNoInferableTypes } from "./fixNoInferableTypes";
import { fixStrictNonNullAssertions } from "./fixStrictNonNullAssertions";

export const builtInFileMutators: ReadonlyArray<[string, FileMutator]> = [
    ["fixImportExtensions", fixImportExtensions],
    ["fixIncompleteTypes", fixIncompleteTypes],
    ["fixMissingProperties", fixMissingProperties],
    ["fixNoImplicitAny", fixNoImplicitAny],
    ["fixNoImplicitThis", fixNoImplicitThis],
    ["fixNoInferableTypes", fixNoInferableTypes],
    ["fixStrictNonNullAssertions", fixStrictNonNullAssertions],
];
