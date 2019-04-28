import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { printNewLine } from "../../shared/printing";
import { createTypeName } from "../aliasing";

import { TypeSummariesByName, TypeSummary } from "./summarization";

/**
 * Adds new named type properties to a declaration that is missing them.
 */
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

const getEndInsertionPoint = ({ end, members }: ts.InterfaceDeclaration | ts.TypeLiteralNode) => {
    if (members.length === 0) {
        return end - 1;
    }

    const lastMember = members[members.length - 1];

    return Math.min(lastMember.end + 1, end);
};

const printMissingType = (request: FileMutationsRequest, name: string, summary: TypeSummary): string => {
    return [
        name,
        summary.alwaysProvided ? "?: " : ": ",
        createTypeName(request, ...summary.types),
        ";",
        printNewLine(request.options.compilerOptions),
    ].join("");
};
