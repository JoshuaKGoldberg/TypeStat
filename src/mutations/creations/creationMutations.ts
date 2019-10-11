import { FileMutationsRequest } from "../../mutators/fileMutator";
import { printNewLine } from "../../shared/printing/newlines";
import { printNamedTypeSummaries } from "../../shared/printing/nodePrinting";
import { TypeSummariesByName } from "../expansions/summarization";

export const createDeclarationForTypeSummaries = (request: FileMutationsRequest, name: string, typeSummaries: TypeSummariesByName) => {
    const printedSummaries = printNamedTypeSummaries(request, typeSummaries),
        newLine = printNewLine(request.options.compilerOptions);

    return [`type ${name} = {`, newLine, printedSummaries, `};`].join("");
};
