import { findFirstMutations } from "../../../../shared/runtime";
import { FileMutationsRequest, FileMutator } from "../../../../shared/fileMutator";

import { fixIncompleteImplicitClassGenerics } from "./fixIncompleteImplicitClassGenerics";
import { fixIncompleteImplicitVariableGenerics } from "./fixIncompleteImplicitVariableGenerics";

export const fixIncompleteImplicitGenerics: FileMutator = (request: FileMutationsRequest) =>
    findFirstMutations(request, [
        ["fixIncompleteImplicitClassGenerics", fixIncompleteImplicitClassGenerics],
        ["fixIncompleteImplicitVariableGenerics", fixIncompleteImplicitVariableGenerics],
    ]);
