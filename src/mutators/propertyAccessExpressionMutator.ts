import * as ts from "typescript";

import { ITextInsertMutation } from "automutate";
import { isTypeFlagSetRecursively } from "../mutations/collecting";
import { FileMutationsRequest, FileMutator } from "./fileMutator";

export const propertyAccessExpressionMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<ITextInsertMutation> => {
    // This fixer is only relevant right now if strict null checking is enabled
    // Later, it might be used to declare types: https://github.com/JoshuaKGoldberg/TypeStat/issues/17
    if (!request.options.fixes.strictNullChecks) {
        return [];
    }


    const mutations: ITextInsertMutation[] = [];

    const visitNode = (node: ts.Node) => {
        if (ts.isPropertyAccessExpression(node)) {
            const mutation = visitPropertyAccessExpression(node, request);

            if (mutation !== undefined) {
                mutations.push(mutation);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(request.sourceFile, visitNode);

    return mutations;
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
