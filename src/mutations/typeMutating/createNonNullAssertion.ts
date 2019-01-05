import { ITextInsertMutation, ITextSwapMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { findAliasOfType } from "../aliasing";

// The following node types need to be wrapped in parenthesis to stop the ! from being applied to the wrong (last) element:
// As expressions: foo as Bar
// Binary expressions: foo && bar
// Conditional expressions: foo ? bar : baz
// Void expressions: void 0
const wrappedKinds = new Set([
    ts.SyntaxKind.AsExpression,
    ts.SyntaxKind.AwaitExpression,
    ts.SyntaxKind.BinaryExpression,
    ts.SyntaxKind.ConditionalExpression,
    ts.SyntaxKind.VoidExpression,
]);

export const createNonNullAssertion = (request: FileMutationsRequest, node: ts.Node): ITextInsertMutation | ITextSwapMutation => {
    const assertion = findAliasOfType("!", request.options.types.aliases);

    if (wrappedKinds.has(node.kind)) {
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
