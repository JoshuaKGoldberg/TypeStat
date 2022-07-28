import { findFirstMutations } from "../../../../shared/runtime";
import { FileMutationsRequest } from "../../../fileMutator";

import { fixReactPropsFromLaterAssignments } from "./fixReactPropsFromLaterAssignments";
import { fixReactPropsFromUses } from "./fixReactPropsFromUses";
import { fixReactPropsFromPropTypes } from "./fixReactPropsFromPropTypes";
import { fixReactPropFunctionsFromCalls } from "./fixReactPropFunctionsFromCalls";
import { fixReactPropsMissing } from "./fixReactPropsMissing";

export const fixIncompleteReactTypes = (request: FileMutationsRequest) =>
    findFirstMutations(request, [
        // Intentionally look at internal uses before later assignments,
        // as they're less likely to contain misleading type information
        ["fixReactPropsFromUses", fixReactPropsFromUses],
        ["fixReactPropsFromLaterAssignments", fixReactPropsFromLaterAssignments],

        ["fixReactPropFunctionsFromCalls", fixReactPropFunctionsFromCalls],

        // Use propTypes with lower priority than uses, assignments, and calls
        // In practical code they are often wrong
        ["fixReactPropsFromPropTypes", fixReactPropsFromPropTypes],

        // Lastly, if the component is missing a props type altogether, create one from scratch
        ["fixReactPropsMissing", fixReactPropsMissing],
    ]);
