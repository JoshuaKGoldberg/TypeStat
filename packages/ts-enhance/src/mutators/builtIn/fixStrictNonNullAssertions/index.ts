import { FileMutationsRequest } from "../../../shared/fileMutator.js";
import { findFirstMutations } from "../../../shared/runtime.js";
import { fixStrictNonNullAssertionBinaryExpressions } from "./fixStrictNonNullAssertionBinaryExpressions/index.js";
import { fixStrictNonNullAssertionCallExpressions } from "./fixStrictNonNullAssertionCallExpressions/index.js";
import { fixStrictNonNullAssertionObjectLiterals } from "./fixStrictNonNullAssertionObjectLiterals/index.js";
import { fixStrictNonNullAssertionPropertyAccesses } from "./fixStrictNonNullAssertionPropertyAccesses/index.js";
import { fixStrictNonNullAssertionReturnTypes } from "./fixStrictNonNullAssertionReturnTypes/index.js";

export const fixStrictNonNullAssertions = (request: FileMutationsRequest) =>
	request.options.fixes.strictNonNullAssertions
		? findFirstMutations(request, [
				[
					"fixStrictNonNullAssertionBinaryExpressions",
					fixStrictNonNullAssertionBinaryExpressions,
				],
				[
					"fixStrictNonNullAssertionCallExpressions",
					fixStrictNonNullAssertionCallExpressions,
				],
				[
					"fixStrictNonNullAssertionObjectLiterals",
					fixStrictNonNullAssertionObjectLiterals,
				],
				[
					"fixStrictNonNullAssertionPropertyAccesses",
					fixStrictNonNullAssertionPropertyAccesses,
				],
				[
					"fixStrictNonNullAssertionReturnTypes",
					fixStrictNonNullAssertionReturnTypes,
				],
		  ])
		: undefined;
