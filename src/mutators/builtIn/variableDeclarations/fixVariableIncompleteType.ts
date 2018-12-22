import * as tsutils from "tsutils";
import * as ts from "typescript";

import { createTypeAdditionMutation, createTypeCreationMutation } from "../../../mutations/creators";
import { isNodeWithType } from "../../../shared/nodeTypes";
import { isNodeFilteredOut } from "../../../shared/references";
import { FileMutationsRequest } from "../../fileMutator";

export const fixVariableIncompleteType = (request: FileMutationsRequest, node: ts.VariableDeclaration) => {
    // Collect types later assigned to the variable, and types initially declared by or inferred on the variable
    const assignedTypes = collectVariableAssignedTypes(node, request);
    const declaredType = request.services.program.getTypeChecker().getTypeAtLocation(node);

    // If the variable already has a declared type, add assigned types to it if necessary
    if (isNodeWithType(node)) {
        return createTypeAdditionMutation(request, node, declaredType, assignedTypes);
    }

    // Since the node's missing type isn't inferrable, try our best to give it one
    return createTypeCreationMutation(request, node, declaredType, assignedTypes);
};

/**
 * Finds types later assigned to a variable declaration.
 *
 * @param node   Node to collect types from.
 * @param request   Metadata and settings to collect mutations in a file.
 * @returns Types assigned to the node in the file.
 */
const collectVariableAssignedTypes = (node: ts.VariableDeclaration, request: FileMutationsRequest): ReadonlyArray<ts.Type> => {
    const assignedTypes: ts.Type[] = [];

    // If the variable has an initial value, consider that an assignment
    if (node.initializer !== undefined) {
        assignedTypes.push(request.services.program.getTypeChecker().getTypeAtLocation(node.initializer));
    }

    // If the variable is anonymous or marked as readonly, don't bother checking for more types
    if (!ts.isIdentifier(node.name) || tsutils.isModifierFlagSet(node, ts.ModifierFlags.Readonly)) {
        return assignedTypes;
    }

    // Collect all places in the file where the variable is later referenced
    const variableInfo = request.fileInfoCache.getVariableUsage().get(node.name);
    if (variableInfo === undefined) {
        return assignedTypes;
    }

    for (const use of variableInfo.uses) {
        const useIdentifier = use.location;
        const useExpression = useIdentifier.parent;

        // Ignore the node usage if it's inside an ignored node
        if (isNodeFilteredOut(request.filteredNodes, use.location)) {
            continue;
        }

        // We only care about binary expressions that assign a type to the variable
        if (
            !ts.isBinaryExpression(useExpression) ||
            useExpression.operatorToken.getText(request.sourceFile) !== "=" ||
            useExpression.left !== useIdentifier
        ) {
            continue;
        }

        // Grab the new type being assigned to the node
        assignedTypes.push(request.services.program.getTypeChecker().getTypeAtLocation(useExpression.right));
    }

    return assignedTypes;
};
