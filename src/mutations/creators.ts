import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { NodeWithAddableType, NodeWithCreatableType } from "../shared/nodeTypes";
import { joinIntoType } from "./aliasing";
import { collectUsageFlagsAndSymbols } from "./collecting";
import { createTypescriptTypeAdditionMutation } from "./modes/typescript/addition";
import { createTypescriptTypeCreationMutation } from "./modes/typescript/creation";

/**
 * Creates a mutation to add types to an existing type, if any are new.
 * 
 * @param request   Source file, metadata, and settings to collect mutations in the file.
 * @param node   Original node with a type declaration to add to.
 * @param declaredType   Declared type from the node.
 * @param allAssignedTypes   Types now assigned to the node.
 * @returns Mutation to add any new assigned types, if any are missing from the declared type.
 */
export const createTypeAdditionMutation = (
    request: FileMutationsRequest,
    node: NodeWithAddableType,
    declaredType: ts.Type,
    allAssignedTypes: ReadonlyArray<ts.Type>,
): ITextInsertMutation | undefined => {
    // Find the any missing flags and symbols (a.k.a. types)
    const { missingFlags, missingTypes } = collectUsageFlagsAndSymbols(request, declaredType, allAssignedTypes);

    // If nothing is missing, rejoice! The type was already fine.
    if (missingFlags.size === 0 && missingTypes.size === 0) {
        return undefined;
    }

    // Join the missing types into a type string to declare
    const newTypeAlias = joinIntoType(missingFlags, missingTypes, request.options.typeAliases);
    if (newTypeAlias === undefined) {
        return undefined;
    }

    // Create a mutation insertion that adds the missing types in
    return createTypescriptTypeAdditionMutation(node, newTypeAlias);
};

/**
 * Creates a mutation to add types to a node without a type, if any are new.
 * 
 * @param request   Metadata and settings to collect mutations in a file.
 * @param begin   Starting position to add types at.
 * @param declaredType   Declared type from the node.
 * @param allAssignedTypes   Types now assigned to the node.
 * @returns Mutation to add any new assigned types, if any are missing from the declared type.
 */
export const createTypeCreationMutation = (
    request: FileMutationsRequest,
    node: NodeWithCreatableType,
    declaredType: ts.Type,
    allAssignedTypes: ReadonlyArray<ts.Type>,
): ITextInsertMutation | undefined => {
    // Find the already assigned flags and symbols, as well as any missing ones
    const { assignedFlags, assignedTypes, missingFlags, missingTypes } = collectUsageFlagsAndSymbols(request, declaredType, allAssignedTypes);

    // If nothing is missing, rejoice! The type was already fine.
    if (missingFlags.size === 0 && missingTypes.size === 0) {
        return undefined;
    }

    // Join the missing types into a type string to declare
    const newTypeAlias = joinIntoType(assignedFlags, assignedTypes, request.options.typeAliases);
    if (newTypeAlias === undefined) {
        return undefined;
    }

    // Create a mutation insertion that adds the assigned types in
    return createTypescriptTypeCreationMutation(node, newTypeAlias);
};
