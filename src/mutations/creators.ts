import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { joinIntoType } from "./aliasing";
import { collectUsageFlagsAndSymbols } from "./collecting";
import { createTypescriptTypeAdditionMutation, createTypescriptTypeCreationMutation } from "./typescript";

/**
 * Creates a mutation to add types to an existing type, if any are new.
 * 
 * @param request   Metadata and settings to collect mutations in a file.
 * @param typeNode   Original type declaration node.
 * @param declaredType   Declared type from the node.
 * @param allAssignedTypes   Types now assigned to the node.
 * @returns Mutation to add any new assigned types, if any are missing from the declared type.
 */
export const createTypeAdditionMutation = (
    request: FileMutationsRequest,
    typeNode: ts.TypeNode,
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
    return createTypescriptTypeAdditionMutation(typeNode, newTypeAlias);
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
    begin: number,
    declaredType: ts.Type,
    allAssignedTypes: ReadonlyArray <ts.Type>,
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
    return createTypescriptTypeCreationMutation(begin, newTypeAlias);
};

