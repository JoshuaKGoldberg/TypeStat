import { combineMutations, Mutation, TextInsertMutation, TextSwapMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { isKnownGlobalBaseType, isNeverAndOrUnknownType, PropertySignatureWithType } from "../../shared/nodeTypes";

import { TypeSummary } from "./summarization";

export type TypeSummariesPerNodeByName = Map<string, TypeSummaryWithNode>;

export interface TypeSummaryWithNode {
    summary: TypeSummary;
    originalProperty: PropertySignatureWithType;
    originalPropertyType: ts.Type;
}

/**
 * Appends new types as union type nodes to existing, apparently incomplete types.
 */
export const addIncompleteTypesToType = (
    request: FileMutationsRequest,
    incompleteTypes: TypeSummariesPerNodeByName,
): Mutation | undefined => {
    const mutations: Mutation[] = [];

    for (const summaryWithNode of incompleteTypes.values()) {
        const mutation = fillInIncompleteType(request, summaryWithNode);

        if (mutation !== undefined) {
            mutations.push(mutation);
        }
    }

    return mutations.length === 0 ? undefined : combineMutations(...mutations);
};

const fillInIncompleteType = (
    request: FileMutationsRequest,
    summaryWithNode: TypeSummaryWithNode,
): TextInsertMutation | TextSwapMutation | undefined => {
    // Create a new type name to add on that joins the types to be added
    let createdTypeName = request.services.printers.type(
        summaryWithNode.summary.types,
        summaryWithNode.originalProperty.type ?? summaryWithNode.originalProperty,
    );

    // For some reason, the enclosingNode option of printing isn't always applying...
    if (createdTypeName.includes("=>")) {
        createdTypeName = `(${createdTypeName})`;
    }

    // Similar to createTypeAdditionMutation, if the node is a basic base type, we can just replace it
    if (
        summaryWithNode.originalProperty.type !== undefined &&
        (isKnownGlobalBaseType(summaryWithNode.originalPropertyType) || isNeverAndOrUnknownType(summaryWithNode.originalPropertyType))
    ) {
        return {
            insertion: `: ${createdTypeName}`,
            range: {
                begin: summaryWithNode.originalProperty.name.end,
                end: summaryWithNode.originalProperty.type.end,
            },
            type: "text-swap",
        };
    }

    // Otherwise, add to the original node property's types
    return {
        insertion: ` | ${createdTypeName}`,
        range: {
            begin: summaryWithNode.originalProperty.type.end,
        },
        type: "text-insert",
    };
};
