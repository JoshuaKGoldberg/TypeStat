import { findFirstMutations } from "../../../../shared/runtime";
import { FileMutationsRequest } from "../../../fileMutator";

import { fixReactPropsFromLaterAssignments } from "./fixReactPropsFromLaterAssignments";
import { fixReactPropsFromUses } from "./fixReactPropsFromUses";
import { fixReactPropsFromPropTypes } from "./fixReactPropsFromPropTypes";
import { fixReactPropFunctionsFromCalls } from "./fixReactPropFunctionsFromCalls";

export const fixIncompleteReactTypes = (request: FileMutationsRequest) =>
    findFirstMutations(request, [
        // Intentionally look at internal uses before later assignments,
        // as they're less likely to contain misleading type information
        ["fixReactPropsFromUses", fixReactPropsFromUses],
        ["fixReactPropsFromLaterAssignments", fixReactPropsFromLaterAssignments],

        ["fixReactPropFunctionsFromCalls", fixReactPropFunctionsFromCalls],

        // Fill in any missing explicitly declared prop types as a last resort
        ["fixReactPropsFromPropTypes", fixReactPropsFromPropTypes],
    ]);
