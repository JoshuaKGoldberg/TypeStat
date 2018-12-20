import { IMutation } from "automutate";
import * as ts from "typescript";

import { canNodeBeFixedForNoImplicitAny, getNoImplicitAnyMutations } from "../../mutations/codeFixes/noImplicitAny";
import { createTypeAdditionMutation, createTypeCreationMutation } from "../../mutations/creators";
import { findNodeByStartingPosition } from "../../shared/nodes";
import { isNodeWithType } from "../../shared/nodeTypes";
import { collectMutationsFromNodes } from "../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../fileMutator";

export const parameterMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> =>
    collectMutationsFromNodes(request, ts.isParameter, visitParameterDeclaration);

const visitParameterDeclaration = (node: ts.ParameterDeclaration, request: FileMutationsRequest): IMutation | undefined => {
    // If the property violates --noImplicitAny (has no type or initializer), this can only be a --noImplicitAny fix
    if (canNodeBeFixedForNoImplicitAny(node)) {
        return getNoImplicitAnyMutations(node, request);
    }

    // If we don't add missing types, there's nothing else to do
    if (!request.options.fixes.incompleteTypes) {
        return undefined;
    }

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

const getCallingTypesFromReferencedSymbols = (
    node: ts.ParameterDeclaration,
    request: FileMutationsRequest,
): ReadonlyArray<ts.Type> => {
    const callingTypes: ts.Type[] = [];

    // If the parameter has a default, also consider that a calling type
    if (node.initializer !== undefined) {
        callingTypes.push(request.services.program.getTypeChecker().getTypeAtLocation(node.initializer));
    }

    // Find all locations the containing method is called
    const references = request.fileInfoCache.getNodeReferences(node.parent);
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
    reference: ts.ReferenceEntry,
    callingTypes: ts.Type[],
    request: FileMutationsRequest,
): void => {
    // Make sure the reference doesn't just (re-)define the property
    if (reference.isDefinition) {
        return;
    }

    // Grab the source file containing the reference
    const referencingSourceFile = request.services.program.getSourceFile(reference.fileName);
    if (referencingSourceFile === undefined) {
        return;
    }

    // In order to be calling with this parameter, the referencing node should be an expression...
    const callingNode = findNodeByStartingPosition(referencingSourceFile, reference.textSpan.start);
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
