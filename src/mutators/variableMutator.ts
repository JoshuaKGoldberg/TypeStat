import * as tsutils from "tsutils";
import * as ts from "typescript";

import { IMutation } from "automutate";
import { canNodeBeFixedForNoImplicitAny, getNoImplicitAnyMutations } from "../mutations/codeFixes/noImplicitAny";
import { createTypeAdditionMutation, createTypeCreationMutation } from "../mutations/creators";
import { isNodeWithType } from "../shared/nodeTypes";
import { FileMutationsRequest, FileMutator } from "./fileMutator";

export const variableMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    const mutations: IMutation[] = [];

    const visitNode = (node: ts.Node) => {
        if (ts.isVariableDeclaration(node)) {
            const mutation = visitVariableDeclaration(node, request);
            if (mutation !== undefined) {
                mutations.push(mutation);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(request.sourceFile, visitNode);

    return mutations;
};

const visitVariableDeclaration = (node: ts.VariableDeclaration, request: FileMutationsRequest): IMutation | undefined => {
    // For-of loop varibles cannot have types, so don't bother trying to add them
    if (ts.isForOfStatement(node.parent.parent)) {
        return undefined;
    }

    // If the variable violates --noImplicitAny (has no type or initializer), this can only be a --noImplicitAny fix
    if (canNodeBeFixedForNoImplicitAny(node)) {
        return getNoImplicitAnyMutations(node, request);
    }

    // If we don't add missing types, there's nothing else to do
    if (!request.options.fixes.incompleteTypes) {
        return undefined;
    }

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

        // We care about binary expressions that assign a type to the variable
        if (ts.isBinaryExpression(useExpression) && useExpression.left === useIdentifier) {
            // Grab the new type being assigned to the node
            assignedTypes.push(request.services.program.getTypeChecker().getTypeAtLocation(useExpression.right));
        }
    }

    return assignedTypes;
};
