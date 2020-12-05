import { IMutation } from "automutate";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { createTypeAdditionMutation, createTypeCreationMutation } from "../../../../mutations/creators";
import { isNodeAssigningBinaryExpression } from "../../../../shared/nodes";
import { isNodeWithType, NodeWithType } from "../../../../shared/nodeTypes";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

export const fixIncompletePropertyDeclarationTypes: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> =>
    collectMutationsFromNodes(request, isPropertyDeclarationWithType, visitPropertyDeclaration);

const isPropertyDeclarationWithType = (node: ts.Node): node is ts.PropertyDeclaration & NodeWithType =>
    ts.isPropertyDeclaration(node) && isNodeWithType(node);

const visitPropertyDeclaration = (node: ts.PropertyDeclaration, request: FileMutationsRequest): IMutation | undefined => {
    // Collect types later assigned to the property, and types initially declared by or inferred on the property
    const assignedTypes = collectPropertyAssignedTypes(node, request);
    const declaredType = request.services.program.getTypeChecker().getTypeAtLocation(node);

    // If the property already has a declared type, add assigned types to it if necessary
    if (isNodeWithType(node)) {
        return createTypeAdditionMutation(request, node, declaredType, assignedTypes);
    }

    // Since the parameter doesn't have its own type, give it one if necessary
    return createTypeCreationMutation(request, node, declaredType, assignedTypes);
};

const collectPropertyAssignedTypes = (node: ts.PropertyDeclaration, request: FileMutationsRequest): ReadonlyArray<ts.Type> => {
    const assignedTypes: ts.Type[] = [];

    // If the property has an initial value, consider that an assignment
    if (node.initializer !== undefined) {
        assignedTypes.push(request.services.program.getTypeChecker().getTypeAtLocation(node.initializer));
    }

    // If the property is marked as readonly, don't bother checking for more types
    if (tsutils.isModifierFlagSet(node, ts.ModifierFlags.Readonly)) {
        return assignedTypes;
    }

    // Find everything else referencing the property
    const references = request.fileInfoCache.getNodeReferencesAsNodes(node);
    if (references !== undefined) {
        // For each referencing location, update types if the type is assigned to there
        for (const reference of references) {
            updateAssignedTypesForReference(node.parent, reference, assignedTypes, request);
        }
    }

    return assignedTypes;
};

/**
 * Adds missing types for a reference to a property.
 *
 * @param identifier   Node referencing the property.
 * @param assignedTypes   In-progress collection of types assigned to a property.
 * @param request   Metadata and settings to collect mutations in a file.
 */
const updateAssignedTypesForReference = (
    targetClass: ts.ClassLikeDeclaration,
    identifier: ts.Node,
    assignedTypes: ts.Type[],
    request: FileMutationsRequest,
): void => {
    // In order to write a new type, the referencing node should be an identifier...
    if (!ts.isIdentifier(identifier)) {
        return;
    }

    // ...contained as a name inside a property access...
    const propertyAccess = identifier.parent;
    if (!ts.isPropertyAccessExpression(propertyAccess) || propertyAccess.name !== identifier) {
        return;
    }

    // ...contained as the left-hand side of an "=" binary expression...
    const binaryExpression = propertyAccess.parent;
    if (!isNodeAssigningBinaryExpression(binaryExpression) || binaryExpression.left !== propertyAccess) {
        return;
    }

    // ...and where the original property access expression refers to the target class
    // (this is important when multiple child classes of a single base class redeclare a member, such as React.Component's state)
    const assigneeType = request.services.program.getTypeChecker().getTypeAtLocation(propertyAccess.expression);
    if (assigneeType.getSymbol()?.valueDeclaration !== targetClass) {
        return;
    }

    // Mark the type of the right-hand side of the "=" expression as being assigned
    assignedTypes.push(request.services.program.getTypeChecker().getTypeAtLocation(binaryExpression.right));
};
