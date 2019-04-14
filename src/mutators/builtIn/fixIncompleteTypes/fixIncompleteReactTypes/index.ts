import { findFirstMutations } from "../../../../shared/runtime";
import { FileMutationsRequest } from "../../../fileMutator";

import { fixReactPropsFromLaterAssignments } from "./fixReactPropsFromLaterAssignments";
import { fixReactPropsFromPropTypes } from "./fixReactPropsFromPropTypes";

export const fixIncompleteReactTypes = (request: FileMutationsRequest) =>
    findFirstMutations(request, [
        ["fixReactPropsFromPropTypes", fixReactPropsFromPropTypes],
        ["fixReactPropsFromLaterAssignments", fixReactPropsFromLaterAssignments],
        // Todo: also add a fixReactPropsWithoutPropTypes
        // This would be equivalen to expansionMutations, but like a typeCreationMutation
    ]);
