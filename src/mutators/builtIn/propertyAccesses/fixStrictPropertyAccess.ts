import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { isTypeFlagSetRecursively } from "../../../mutations/collecting/flags";
import { FileMutationsRequest } from "../../fileMutator";

export const getStrictPropertyAccessFix = (
    request: FileMutationsRequest,
    node: ts.PropertyAccessExpression,
): ITextInsertMutation | undefined => {
    // Don't do anything if we don't fix for strict null checks
    if (!request.options.fixes.strictNullChecks) {
        return undefined;
    }

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
