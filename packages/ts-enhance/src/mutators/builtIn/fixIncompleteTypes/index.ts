import { FileMutationsRequest } from "../../../shared/fileMutator.js";
import { findFirstMutations } from "../../../shared/runtime.js";
import { fixIncompleteImplicitGenerics } from "./fixIncompleteImplicitGenerics/index.js";
import { fixIncompleteInterfaceOrTypeLiteralGenerics } from "./fixIncompleteInterfaceOrTypeLiteralGenerics/index.js";
import { fixIncompleteParameterTypes } from "./fixIncompleteParameterTypes/index.js";
import { fixIncompletePropertyDeclarationTypes } from "./fixIncompletePropertyDeclarationTypes/index.js";
import { fixIncompleteReactTypes } from "./fixIncompleteReactTypes/index.js";
import { fixIncompleteReturnTypes } from "./fixIncompleteReturnTypes/index.js";
import { fixIncompleteVariableTypes } from "./fixIncompleteVariableTypes/index.js";

export const fixIncompleteTypes = (request: FileMutationsRequest) =>
	request.options.fixes.incompleteTypes
		? findFirstMutations(request, [
				["fixIncompleteImplicitGenerics", fixIncompleteImplicitGenerics],
				[
					"fixIncompleteInterfaceOrTypeLiteralGenerics",
					fixIncompleteInterfaceOrTypeLiteralGenerics,
				],
				["fixIncompleteParameterTypes", fixIncompleteParameterTypes],
				[
					"fixIncompletePropertyDeclarationTypes",
					fixIncompletePropertyDeclarationTypes,
				],
				["fixIncompleteReactTypes", fixIncompleteReactTypes],
				["fixIncompleteReturnTypes", fixIncompleteReturnTypes],
				["fixIncompleteVariableTypes", fixIncompleteVariableTypes],
		  ])
		: undefined;
