import { Mutation } from "automutate";
import * as ts from "typescript";

import { isTypeFlagSetRecursively } from "../../../../mutations/collecting/flags";
import { createNonNullAssertion } from "../../../../mutations/typeMutating/createNonNullAssertion";
import { isNodeAssigningBinaryExpression } from "../../../../shared/nodes";
import { getTypeAtLocationIfNotError } from "../../../../shared/types";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

export const fixStrictNonNullAssertionBinaryExpressions: FileMutator = (request: FileMutationsRequest): ReadonlyArray<Mutation> => {
    return collectMutationsFromNodes(request, isNodeAssigningBinaryExpression, visitBinaryExpression);
};

const visitBinaryExpression = (node: ts.BinaryExpression, request: FileMutationsRequest): Mutation | undefined => {
    // Grab the types of the declared and assigned nodes
    const assignedType = getTypeAtLocationIfNotError(request, node.right);
    if (assignedType === undefined) {
        return undefined;
    }

    const declaredType = getTypeAtLocationIfNotError(request, node.left);
    if (declaredType === undefined) {
        return undefined;
    }

    // We only care if the assigned type contains a strict flag the declared type doesn't
    if (
        (isTypeFlagSetRecursively(declaredType, ts.TypeFlags.Null) || !isTypeFlagSetRecursively(assignedType, ts.TypeFlags.Null)) &&
        (isTypeFlagSetRecursively(declaredType, ts.TypeFlags.Undefined) || !isTypeFlagSetRecursively(assignedType, ts.TypeFlags.Undefined))
    ) {
        return undefined;
    }

    return createNonNullAssertion(request, node.right);
};
