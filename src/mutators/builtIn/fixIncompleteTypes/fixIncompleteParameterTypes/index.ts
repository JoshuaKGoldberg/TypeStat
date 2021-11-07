import { Mutation } from "automutate";
import * as ts from "typescript";

import { createTypeAdditionMutation, createTypeCreationMutation } from "../../../../mutations/creators";
import { isNodeWithType, NodeWithType } from "../../../../shared/nodeTypes";
import { getTypeAtLocationIfNotError } from "../../../../shared/types";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

export const fixIncompleteParameterTypes: FileMutator = (request: FileMutationsRequest): ReadonlyArray<Mutation> =>
    collectMutationsFromNodes(request, isParameterWithType, visitParameterDeclaration);

const isParameterWithType = (node: ts.Node): node is ts.ParameterDeclaration & NodeWithType => ts.isParameter(node) && isNodeWithType(node);

const visitParameterDeclaration = (node: ts.ParameterDeclaration, request: FileMutationsRequest): Mutation | undefined => {
    // Collect types initially assigned or later called with as the parameter
    const callingTypes = getCallingTypesFromReferencedSymbols(node, request);

    // Collect the type(s) initially declared on the parameter
    const declaredType = getTypeAtLocationIfNotError(request, node);
    if (declaredType === undefined) {
        return undefined;
    }

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
    const initializerType = getTypeAtLocationIfNotError(request, node.initializer);
    if (initializerType !== undefined) {
        callingTypes.push(initializerType);
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
    const callingType = getTypeAtLocationIfNotError(request, callingNode.expression.arguments[parameterIndex]);
    if (callingType !== undefined) {
        callingTypes.push(callingType);
    }
};
