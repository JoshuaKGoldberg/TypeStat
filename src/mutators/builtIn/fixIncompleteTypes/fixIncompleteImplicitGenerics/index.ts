import { findFirstMutations } from "../../../../shared/runtime";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

import { fixIncompleteImplicitVariableGenerics } from "./fixIncompleteImplicitClassGenerics";
import { fixIncompleteImplicitClassGenerics } from "./fixIncompleteImplicitVariableGenerics";

export const fixIncompleteImplicitGenerics: FileMutator = (request: FileMutationsRequest) =>
    findFirstMutations(request, [
        ["fixIncompleteImplicitClassGenerics", fixIncompleteImplicitClassGenerics],
        ["fixIncompleteImplicitVariableGenerics", fixIncompleteImplicitVariableGenerics],
    ]);
