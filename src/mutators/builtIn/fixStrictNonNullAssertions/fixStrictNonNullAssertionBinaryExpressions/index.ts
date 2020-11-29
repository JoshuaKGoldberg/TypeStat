import { IMutation } from "automutate";
import * as ts from "typescript";

import { isTypeFlagSetRecursively } from "../../../../mutations/collecting/flags";
import { createNonNullAssertion } from "../../../../mutations/typeMutating/createNonNullAssertion";
import { isNodeAssigningBinaryExpression } from "../../../../shared/nodes";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

export const fixStrictNonNullAssertionBinaryExpressions: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    return collectMutationsFromNodes(request, isNodeAssigningBinaryExpression, visitBinaryExpression);
};

const visitBinaryExpression = (node: ts.BinaryExpression, request: FileMutationsRequest): IMutation | undefined => {
    // Grab the types of the declared and assigned nodes
    const typeChecker = request.services.program.getTypeChecker();
    const assignedType = typeChecker.getTypeAtLocation(node.right);
    const declaredType = typeChecker.getTypeAtLocation(node.left);

    // We only care if the assigned type contains a strict flag the declared type doesn't
    if (
        (isTypeFlagSetRecursively(declaredType, ts.TypeFlags.Null) || !isTypeFlagSetRecursively(assignedType, ts.TypeFlags.Null)) &&
        (isTypeFlagSetRecursively(declaredType, ts.TypeFlags.Undefined) || !isTypeFlagSetRecursively(assignedType, ts.TypeFlags.Undefined))
    ) {
        return undefined;
    }

    return createNonNullAssertion(request, node.right);
};
