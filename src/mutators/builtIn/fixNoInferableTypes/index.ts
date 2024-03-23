import { FileMutationsRequest } from "../../../shared/fileMutator.js";
import { findFirstMutations } from "../../../shared/runtime.js";
import { fixNoInferableTypesParameters } from "./fixNoInferableTypesParameters/index.js";
import { fixNoInferableTypesPropertyDeclarations } from "./fixNoInferableTypesPropertyDeclarations/index.js";
import { fixNoInferableTypesVariableDeclarations } from "./fixNoInferableTypesVariableDeclarations/index.js";

export const fixNoInferableTypes = (request: FileMutationsRequest) =>
	request.options.fixes.noInferableTypes
		? findFirstMutations(request, [
				["fixNoInferableTypesParameters", fixNoInferableTypesParameters],
				[
					"fixNoInferableTypesPropertyDeclarations",
					fixNoInferableTypesPropertyDeclarations,
				],
				[
					"fixNoInferableTypesVariableDeclarations",
					fixNoInferableTypesVariableDeclarations,
				],
			])
		: undefined;
