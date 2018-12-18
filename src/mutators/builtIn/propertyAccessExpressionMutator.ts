import * as ts from "typescript";

import { IMutation, ITextInsertMutation } from "automutate";
import { isTypeFlagSetRecursively } from "../../mutations/collecting/flags";
import { collectMutationsFromNodes } from "../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../fileMutator";

export const propertyAccessExpressionMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    // This fixer is only relevant right now if strict null checking is enabled
    // Later, it might be used to declare types: https://github.com/JoshuaKGoldberg/TypeStat/issues/17
    if (!request.options.fixes.strictNullChecks) {
        return [];
    }

    return collectMutationsFromNodes(request, ts.isPropertyAccessExpression, visitPropertyAccessExpression);
};

const visitPropertyAccessExpression = (node: ts.PropertyAccessExpression, request: FileMutationsRequest): ITextInsertMutation | undefined => {
    // Grab the type of the property being accessed by name
    const expressionType = request.services.program.getTypeChecker().getTypeAtLocation(node.expression);

    // If the property's type cannot be null or undefined, rejoice! Nothing to do.
    if (!isTypeFlagSetRecursively(expressionType, ts.TypeFlags.Null | ts.TypeFlags.Undefined)) {
        return undefined;
    }

    // Add a mutation to insert a "!" before the access
    return {
        insertion: "!",
        range: {
            begin: node.expression.end,
        },
        type: "text-insert",
    };
};
