import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { printNewLine } from "../../shared/printing/newlines";
import { printNamedTypeSummaries } from "../../shared/printing/nodePrinting";
import { TypeSummariesByName } from "../expansions/summarization";

export const createDeclarationForTypeSummaries = (
    request: FileMutationsRequest,
    enclosingDeclaration: ts.Node | undefined,
    name: string,
    typeSummaries: TypeSummariesByName,
) => {
    const printedSummaries = printNamedTypeSummaries(request, enclosingDeclaration, typeSummaries);
    const newLine = printNewLine(request.options.compilerOptions);

    return [`type ${name} = {`, newLine, printedSummaries, `};`].join("");
};
