import { Mutation } from "automutate";
import * as ts from "typescript";

import { isTypeFlagSetRecursively } from "../../../../mutations/collecting/flags";
import { createNonNullAssertion } from "../../../../mutations/typeMutating/createNonNullAssertion";
import { getTypeAtLocationIfNotError } from "../../../../shared/types";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

export const fixStrictNonNullAssertionPropertyAccesses: FileMutator = (request: FileMutationsRequest): ReadonlyArray<Mutation> => {
    const visitPropertyAccessExpression = (node: ts.PropertyAccessExpression): Mutation | undefined => {
        return getStrictPropertyAccessFix(request, node);
    };

    return collectMutationsFromNodes(request, ts.isPropertyAccessExpression, visitPropertyAccessExpression);
};

const getStrictPropertyAccessFix = (request: FileMutationsRequest, node: ts.PropertyAccessExpression): Mutation | undefined => {
    // Early on skip checking for "!" needs if there already is one or it's a ?.
    if (ts.isAssertionExpression(node.parent) || ts.isNonNullExpression(node.parent) || node.questionDotToken) {
        return undefined;
    }

    // Grab the type of the property being accessed by name
    const expressionType = getTypeAtLocationIfNotError(request, node.expression);

    // If the property's type cannot be null or undefined, rejoice! Nothing to do.
    if (expressionType === undefined || !isTypeFlagSetRecursively(expressionType, ts.TypeFlags.Null | ts.TypeFlags.Undefined)) {
        return undefined;
    }

    // Add a mutation to insert a "!" before the access
    return createNonNullAssertion(request, node.expression);
};
