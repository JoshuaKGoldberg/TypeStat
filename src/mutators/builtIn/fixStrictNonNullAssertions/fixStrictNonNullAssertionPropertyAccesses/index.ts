import { IMutation } from "automutate";
import * as ts from "typescript";

import { isTypeFlagSetRecursively } from "../../../../mutations/collecting/flags";
import { createNonNullAssertion } from "../../../../mutations/typeMutating/createNonNullAssertion";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

export const fixStrictNonNullAssertionPropertyAccesses: FileMutator = (request: FileMutationsRequest): readonly IMutation[] => {
    const visitPropertyAccessExpression = (node: ts.PropertyAccessExpression): IMutation | undefined => {
        return getStrictPropertyAccessFix(request, node);
    };

    return collectMutationsFromNodes(request, ts.isPropertyAccessExpression, visitPropertyAccessExpression);
};

const getStrictPropertyAccessFix = (request: FileMutationsRequest, node: ts.PropertyAccessExpression): IMutation | undefined => {
    // Grab the type of the property being accessed by name
    const expressionType = request.services.program.getTypeChecker().getTypeAtLocation(node.expression);

    // If the property's type cannot be null or undefined, rejoice! Nothing to do.
    if (!isTypeFlagSetRecursively(expressionType, ts.TypeFlags.Null | ts.TypeFlags.Undefined)) {
        return undefined;
    }

    // Add a mutation to insert a "!" before the access
    return createNonNullAssertion(request, node);
};
