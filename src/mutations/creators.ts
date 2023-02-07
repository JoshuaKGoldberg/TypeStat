import { TextInsertMutation, TextSwapMutation } from "automutate";
import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { isKnownGlobalBaseType, NodeWithAddableType, NodeWithCreatableType } from "../shared/nodeTypes";

import { joinIntoType } from "./aliasing/joinIntoType";
import { collectUsageFlagsAndSymbols } from "./collecting";

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
): TextInsertMutation | TextSwapMutation | undefined => {
    // Find any missing flags and symbols (a.k.a. types)
    const { missingFlags, missingTypes } = collectUsageFlagsAndSymbols(request, declaredType, allAssignedTypes);

    // If nothing is missing, rejoice! The type was already fine.
    if (missingFlags.size === 0 && missingTypes.size === 0) {
        return undefined;
    }

    // Join the missing types into a type string to declare
    const newTypeAlias = joinIntoType(missingFlags, missingTypes, request);
    if (newTypeAlias === undefined) {
        return undefined;
    }

    // If the original type was a bottom type or just something like Function or Object, replace it entirely
    if (tsutils.isTypeFlagSet(declaredType, ts.TypeFlags.Never | ts.TypeFlags.Unknown) || isKnownGlobalBaseType(declaredType)) {
        return {
            insertion: ` ${newTypeAlias}`,
            range: {
                begin: node.type.pos,
                end: node.type.end,
            },
            type: "text-swap",
        };
    }

    // Create a mutation insertion that adds the missing types in
    return {
        insertion: ` | ${newTypeAlias}`,
        range: {
            begin: node.type.end,
        },
        type: "text-insert",
    };
};

/**
 * Creates a mutation to add types to a node without a type, if any are new.
 *
 * @param request   Metadata and settings to collect mutations in a file.
 * @param node   Node to add the type annotation.
 * @param declaredType   Declared type from the node.
 * @param allAssignedTypes   Types now assigned to the node.
 * @returns Mutation to add any new assigned types, if any are missing from the declared type.
 */
export const createTypeCreationMutation = (
    request: FileMutationsRequest,
    node: NodeWithCreatableType,
    declaredType: ts.Type,
    allAssignedTypes: ReadonlyArray<ts.Type>,
): TextInsertMutation | undefined => {
    // Find the already assigned flags and symbols, as well as any missing ones
    const { assignedFlags, assignedTypes, missingFlags, missingTypes } = collectUsageFlagsAndSymbols(
        request,
        declaredType,
        allAssignedTypes,
    );

    // If nothing is missing, rejoice! The type was already fine.
    if (missingFlags.size === 0 && missingTypes.size === 0) {
        return undefined;
    }

    // Join the missing types into a type string to declare
    const newTypeAlias = joinIntoType(assignedFlags, assignedTypes, request);
    if (newTypeAlias === undefined) {
        return undefined;
    }

    // Create a mutation insertion that adds the assigned types in
    return {
        insertion: `: ${newTypeAlias}`,
        range: {
            begin: node.name.end,
        },
        type: "text-insert",
    };
};
