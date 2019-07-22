import * as ts from "typescript";

import { FileMutationsRequest } from "../../../../fileMutator";

import { GenericClassDetails } from "./getGenericClassDetails";
import { VariableWithImplicitGeneric } from "./implicitGenericTypes";

export const collectGenericUses = (
    request: FileMutationsRequest,
    node: VariableWithImplicitGeneric,
    genericClassDetails: GenericClassDetails,
) => {
    const references = request.fileInfoCache.getNodeReferencesAsNodes(node);
    if (references === undefined) {
        return undefined;
    }

    const typeChecker = request.services.program.getTypeChecker();
    const assignedParameterTypes = new Map<string, ts.Type[]>();

    const addAssignmentToTypeParameter = (typeParameterName: string, argumentType: ts.Type) => {
        const existing = assignedParameterTypes.get(typeParameterName);

        if (existing === undefined) {
            assignedParameterTypes.set(typeParameterName, [argumentType]);
        } else {
            existing.push(argumentType);
        }
    };

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

        const memberName = propertyAccessExpression.name.text;
        const memberDetails = genericClassDetails.membersWithGenericParameters.get(memberName);
        if (memberDetails === undefined) {
            continue;
        }

        for (const [parameterIndex, { parameterName, parameterType }] of memberDetails) {
            if (parameterIndex >= callArguments.length) {
                continue;
            }

            addAssignmentToTypeParameter(parameterName, typeChecker.getTypeAtLocation(callArguments[parameterIndex]));

            // If the parameter is a rest parameter, also add assignment types for any following arguments
            if (parameterType.parent.dotDotDotToken !== undefined) {
                for (const callArgument of callArguments.slice(parameterIndex + 1)) {
                    addAssignmentToTypeParameter(parameterName, typeChecker.getTypeAtLocation(callArgument));
                }
            }
        }
    }

    return assignedParameterTypes;
};
