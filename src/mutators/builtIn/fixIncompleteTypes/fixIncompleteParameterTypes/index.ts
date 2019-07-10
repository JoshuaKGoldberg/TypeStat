import { IMutation } from "automutate";
import * as ts from "typescript";

import { createTypeAdditionMutation, createTypeCreationMutation } from "../../../../mutations/creators";
import { isNodeWithType } from "../../../../shared/nodeTypes";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

export const fixIncompleteParameterTypes: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> =>
    collectMutationsFromNodes(request, ts.isParameter, visitParameterDeclaration);

const visitParameterDeclaration = (node: ts.ParameterDeclaration, request: FileMutationsRequest): IMutation | undefined => {
    // Collect types initially assigned or later called with as the parameter
    const callingTypes = getCallingTypesFromReferencedSymbols(node, request);

    // Collect the type(s) initially declared on the parameter
    const declaredType = request.services.program.getTypeChecker().getTypeAtLocation(node);

    // If the parameter already has a declared type, add assigned types to it if necessary
    if (isNodeWithType(node)) {
        return createTypeAdditionMutation(request, node, declaredType, callingTypes);
    }

    // Since the parameter doesn't have its own type, give it one if necessary
    return createTypeCreationMutation(request, node, declaredType, callingTypes);
};

const getCallingTypesFromReferencedSymbols = (node: ts.ParameterDeclaration, request: FileMutationsRequest): ReadonlyArray<ts.Type> => {
    const callingTypes: ts.Type[] = [];

    // If the parameter has a default, also consider that a calling type
    if (node.initializer !== undefined) {
        callingTypes.push(request.services.program.getTypeChecker().getTypeAtLocation(node.initializer));
    }

    // Find all locations the containing method is called
    const references = request.fileInfoCache.getNodeReferencesAsNodes(node.parent);
    if (references !== undefined) {
        const parameterIndex = node.parent.parameters.indexOf(node);

        // For each calling location, add any types it's called with there
        for (const reference of references) {
            updateCallingTypesForReference(parameterIndex, reference, callingTypes, request);
        }
    }

    return callingTypes;
};

const updateCallingTypesForReference = (
    parameterIndex: number,
    callingNode: ts.Node,
    callingTypes: ts.Type[],
    request: FileMutationsRequest,
): void => {
    // In order to be calling with this parameter, the referencing node should be an expression...
    if (!ts.isExpressionStatement(callingNode)) {
        return;
    }

    // ...that calls to the parameter we're looking at
    if (!ts.isCallExpression(callingNode.expression) || callingNode.expression.arguments.length <= parameterIndex) {
        return;
    }

    // Mark the type of parameter at our index as being called with
    callingTypes.push(request.services.program.getTypeChecker().getTypeAtLocation(callingNode.expression.arguments[parameterIndex]));
};
