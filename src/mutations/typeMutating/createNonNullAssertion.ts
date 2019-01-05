import { ITextInsertMutation, ITextSwapMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { findAliasOfType } from "../aliasing";

export const createNonNullAssertion = (request: FileMutationsRequest, node: ts.Node): ITextInsertMutation | ITextSwapMutation => {
    const assertion = findAliasOfType("!", request.options.types.aliases);

    // The following node types need to be wrapped in parenthesis to stop the ! from being applied to the wrong (last) element:
    // As expressions: foo as Bar
    // Binary expressions: foo && bar
    // Conditional expressions: foo ? bar : baz
    // Void expressions: void 0
    if (ts.isAsExpression(node) || ts.isBinaryExpression(node) || ts.isConditionalExpression(node) || ts.isVoidExpression(node)) {
        return {
            insertion: `(${node.getText(request.sourceFile)})${assertion}`,
            range: {
                begin: node.getStart(request.sourceFile),
                end: node.end,
            },
            type: "text-swap",
        };
    }

    return {
        insertion: assertion,
        range: {
            begin: node.end,
        },
        type: "text-insert",
    };
};
