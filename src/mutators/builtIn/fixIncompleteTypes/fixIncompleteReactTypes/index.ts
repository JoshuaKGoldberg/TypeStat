import { findFirstMutations } from "../../../../shared/runtime";
import { FileMutationsRequest } from "../../../fileMutator";

import { fixReactClassProps } from "./fixReactClassProps";

export const fixIncompleteReactTypes = (request: FileMutationsRequest) =>
    findFirstMutations(request, [["fixReactClassProps", fixReactClassProps]]);
