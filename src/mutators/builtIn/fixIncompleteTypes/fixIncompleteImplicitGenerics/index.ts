import {
	FileMutationsRequest,
	FileMutator,
} from "../../../../shared/fileMutator.js";
import { findFirstMutations } from "../../../../shared/runtime.js";
import { fixIncompleteImplicitClassGenerics } from "./fixIncompleteImplicitClassGenerics/index.js";
import { fixIncompleteImplicitVariableGenerics } from "./fixIncompleteImplicitVariableGenerics/index.js";

export const fixIncompleteImplicitGenerics: FileMutator = (
	request: FileMutationsRequest,
) =>
	findFirstMutations(request, [
		["fixIncompleteImplicitClassGenerics", fixIncompleteImplicitClassGenerics],
		[
			"fixIncompleteImplicitVariableGenerics",
			fixIncompleteImplicitVariableGenerics,
		],
	]);
