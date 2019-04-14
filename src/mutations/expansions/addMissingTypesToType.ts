import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { printNewLine } from "../../shared/printing";
import { createTypeName } from "../aliasing";

import { getEndInsertionPoint } from "./getEndInsertionPoint";
import { TypeSummariesByName, TypeSummary } from "./summarization";

export const addMissingTypesToType = (
    request: FileMutationsRequest,
    node: ts.InterfaceDeclaration | ts.TypeLiteralNode,
    missingTypes: TypeSummariesByName,
): ITextInsertMutation | undefined => {
    let insertion = "";

    for (const [name, summary] of missingTypes) {
        insertion += printMissingType(request, name, summary);
    }

    return {
        insertion,
        range: {
            begin: getEndInsertionPoint(node),
        },
        type: "text-insert",
    };
};

/**
 *
 * @todo Extract aliasing logic from `src/mutations/aliasing.ts`
 */
const printMissingType = (request: FileMutationsRequest, name: string, summary: TypeSummary): string => {
    return [
        name,
        summary.alwaysProvided ? "?: " : ": ",
        createTypeName(request, ...summary.types),
        printNewLine(request.options.compilerOptions),
    ].join("");
};
