import { findFirstMutations } from "../../../../shared/runtime";
import { FileMutationsRequest } from "../../../fileMutator";

import { fixReactPropsFromLaterAssignments } from "./fixReactPropsFromLaterAssignments";
import { fixReactPropsFromPropTypes } from "./fixReactPropsFromPropTypes";
import { fixReactPropFunctionsFromCalls } from "./fixReactPropFunctionsFromCalls";

export const fixIncompleteReactTypes = (request: FileMutationsRequest) =>
    findFirstMutations(request, [
        ["fixReactPropsFromPropTypes", fixReactPropsFromPropTypes],
        ["fixReactPropsFromLaterAssignments", fixReactPropsFromLaterAssignments],
        ["fixReactPropFunctionsFromCalls", fixReactPropFunctionsFromCalls],
    ]);
