import * as tsutils from "ts-api-utils";

import { getNoImplicitThisMutations } from "../../../mutations/codeFixes/noImplicitThis.js";
import {
	FileMutationsRequest,
	FileMutator,
} from "../../../shared/fileMutator.js";
import { collectMutationsFromNodes } from "../../collectMutationsFromNodes.js";

export const fixNoImplicitThis: FileMutator = (
	request: FileMutationsRequest,
) =>
	request.options.fixes.noImplicitThis
		? collectMutationsFromNodes(
				request,
				tsutils.isThisExpression,
				getNoImplicitThisMutations,
			)
		: undefined;
