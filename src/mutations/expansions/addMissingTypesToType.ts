import { TextInsertMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../shared/fileMutator";
import { printNamedTypeSummary } from "../../shared/printing/nodePrinting";

import { TypeSummariesByName } from "./summarization";

/**
 * Adds new named type properties to a declaration that is missing them.
 */
export const addMissingTypesToType = (
    request: FileMutationsRequest,
    node: ts.InterfaceDeclaration | ts.TypeLiteralNode,
    missingTypes: TypeSummariesByName,
): TextInsertMutation | undefined => {
    let insertion = "";

    for (const [name, summary] of missingTypes) {
        insertion += printNamedTypeSummary(request, node, name, summary);
    }

    if (!insertion) {
        return undefined;
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
