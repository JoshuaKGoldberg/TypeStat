import { FileMutationsRequest } from "../../../../shared/fileMutator.js";
import { findFirstMutations } from "../../../../shared/runtime.js";
import { fixReactPropFunctionsFromCalls } from "./fixReactPropFunctionsFromCalls/index.js";
import { fixReactPropsFromLaterAssignments } from "./fixReactPropsFromLaterAssignments/index.js";
import { fixReactPropsFromPropTypes } from "./fixReactPropsFromPropTypes/index.js";
import { fixReactPropsFromUses } from "./fixReactPropsFromUses/index.js";
import { fixReactPropsMissing } from "./fixReactPropsMissing.js";

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
