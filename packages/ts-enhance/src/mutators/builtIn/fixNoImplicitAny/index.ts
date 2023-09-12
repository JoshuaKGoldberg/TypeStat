import { FileMutationsRequest } from "../../../shared/fileMutator.js";
import { findFirstMutations } from "../../../shared/runtime.js";
import { fixNoImplicitAnyParameters } from "./fixNoImplicitAnyParameters/index.js";
import { fixNoImplicitAnyPropertyDeclarations } from "./fixNoImplicitAnyPropertyDeclarations/index.js";
import { fixNoImplicitAnyVariableDeclarations } from "./fixNoImplicitAnyVariableDeclarations/index.js";

export const fixNoImplicitAny = (request: FileMutationsRequest) =>
	request.options.fixes.noImplicitAny
		? findFirstMutations(request, [
				[
					"fixNoImplicitAnyPropertyDeclarations",
					fixNoImplicitAnyPropertyDeclarations,
				],
				["fixNoImplicitAnyParameters", fixNoImplicitAnyParameters],
				[
					"fixNoImplicitAnyVariableDeclarations",
					fixNoImplicitAnyVariableDeclarations,
				],
		  ])
		: undefined;
