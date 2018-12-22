import { ITextInsertMutation, ITextSwapMutation } from "automutate";
import * as ts from "typescript";

export const createNonNullAssertionInsertion = (sourceFile: ts.SourceFile, node: ts.Node): ITextInsertMutation | ITextSwapMutation => {
    // The following node types need to be wrapped in parenthesis to stop the ! from being applied to the wrong (last) element:
    // As expressions: foo as Bar
    // Binary expressions: foo && bar
    // Conditional expressions: foo ? bar : baz
    // Void expressions: void 0
    if (ts.isAsExpression(node) || ts.isBinaryExpression(node) || ts.isConditionalExpression(node) || ts.isVoidExpression(node)) {
        return {
            insertion: `(${node.getText(sourceFile)})!`,
            range: {
                begin: node.getStart(sourceFile),
                end: node.end,
            },
            type: "text-swap",
        };
    }

    return {
        insertion: "!",
        range: {
            begin: node.end,
        },
        type: "text-insert",
    };
};
