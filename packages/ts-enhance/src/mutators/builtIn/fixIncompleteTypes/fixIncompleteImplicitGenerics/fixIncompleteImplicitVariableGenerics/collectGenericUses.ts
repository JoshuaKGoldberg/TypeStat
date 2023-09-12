import * as ts from "typescript";

import { FileMutationsRequest } from "../../../../../shared/fileMutator.js";
import { getTypeAtLocationIfNotError } from "../../../../../shared/types.js";
import { GenericClassDetails } from "./getGenericClassDetails.js";
import { VariableWithImplicitGeneric } from "./implicitGenericTypes.js";

/**
 * @returns Map of the names of a class' generic template types to the types passed to them.
 */
export const collectGenericUses = (
	request: FileMutationsRequest,
	node: VariableWithImplicitGeneric,
	genericClassDetails: GenericClassDetails,
): Map<string, ts.Type[]> | undefined => {
	const references = request.fileInfoCache.getNodeReferencesAsNodes(node);
	if (references === undefined) {
		return undefined;
	}

	const assignedParameterTypes = new Map<string, ts.Type[]>();

	const addAssignmentToTypeParameter = (
		typeParameterName: string,
		argumentType: ts.Type,
	) => {
		const existing = assignedParameterTypes.get(typeParameterName);

		if (existing === undefined) {
			assignedParameterTypes.set(typeParameterName, [argumentType]);
		} else {
			existing.push(argumentType);
		}
	};

	// Each reference might contain a call expression to a member of the generic container
	for (const reference of references) {
		if (!ts.isExpressionStatement(reference)) {
			continue;
		}

		const callExpression = reference.expression;
		if (!ts.isCallExpression(callExpression)) {
			continue;
		}

		const callArguments = callExpression.arguments;
		if (callArguments.length === 0) {
			continue;
		}

		const propertyAccessExpression = callExpression.expression;
		if (!ts.isPropertyAccessExpression(propertyAccessExpression)) {
			continue;
		}

		// Only look at members that are known to have the generic parameters, like `indexOf(item: T)`
		const memberName = propertyAccessExpression.name.text;
		const memberDetails =
			genericClassDetails.membersWithGenericParameters.get(memberName);
		if (memberDetails === undefined) {
			continue;
		}

		for (const [
			parameterIndex,
			{ parameterName, parameterType },
		] of memberDetails) {
			if (parameterIndex >= callArguments.length) {
				continue;
			}

			const parameterIndexType = getTypeAtLocationIfNotError(
				request,
				callArguments[parameterIndex],
			);
			if (parameterIndexType === undefined) {
				continue;
			}

			// For each parameter passed to the generic use, we'll record its assignment type
			addAssignmentToTypeParameter(parameterName, parameterIndexType);

			// If the parameter is a rest parameter, also add assignment types for any following arguments
			if (parameterType.parent.dotDotDotToken !== undefined) {
				for (const callArgument of callArguments.slice(parameterIndex + 1)) {
					const callArgumentType = getTypeAtLocationIfNotError(
						request,
						callArgument,
					);
					if (callArgumentType !== undefined) {
						addAssignmentToTypeParameter(parameterName, callArgumentType);
					}
				}
			}
		}
	}

	return assignedParameterTypes;
};
