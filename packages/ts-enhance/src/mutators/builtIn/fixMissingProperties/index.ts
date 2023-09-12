import { FileMutationsRequest } from "../../../shared/fileMutator.js";
import { findFirstMutations } from "../../../shared/runtime.js";
import { fixMissingPropertyAccesses } from "./fixMissingPropertyAccesses/index.js";

export const fixMissingProperties = (request: FileMutationsRequest) =>
	request.options.fixes.missingProperties
		? findFirstMutations(request, [
				["fixMissingPropertyAccesses", fixMissingPropertyAccesses],
		  ])
		: undefined;
