import { EOL } from "os";
import * as ts from "typescript";

export const getQuickErrorSummary = (error: any, stackTraceLimit: number = Infinity): string => {
    if (!(error instanceof Error) || error.stack === undefined) {
        return `${error}`;
    }

    const lines = error.stack.split("\n");

    let output = lines.slice(0, stackTraceLimit).join("\n\t");

    if (lines.length > stackTraceLimit) {
        output += "\n\t    ...";
    }

    return output;
};

export const getQuickNodeText = (node: ts.Node, sourceFile?: ts.SourceFile) => {
    const text = node.getText(sourceFile);
    const shortened = text
        .split("\n")
        .slice(0, 3)
        .join("\n");

    return shortened.length < text.length ? `${shortened}${EOL}...` : shortened;
};
