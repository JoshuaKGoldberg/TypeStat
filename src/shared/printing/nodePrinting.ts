import * as ts from "typescript";

import { TypeSummariesByName, TypeSummary } from "../../mutations/expansions/summarization";
import { FileMutationsRequest } from "../../mutators/fileMutator";
import { printNewLine } from "./newlines";

export const printNamedTypeSummaries = (
    request: FileMutationsRequest,
    enclosingDeclaration: ts.Node | undefined,
    typeSummaries: TypeSummariesByName,
): string => {
    return Array.from(typeSummaries)
        .map(([typeName, typeSummary]) => printNamedTypeSummary(request, enclosingDeclaration, typeName, typeSummary))
        .join("");
};

export const printNamedTypeSummary = (
    request: FileMutationsRequest,
    enclosingDeclaration: ts.Node | undefined,
    name: string,
    summary: TypeSummary,
): string => {
    return [
        name,
        summary.alwaysProvided ? "?: " : ": ",
        request.services.printers.type(summary.types, enclosingDeclaration),
        ";",
        printNewLine(request.options.compilerOptions),
    ].join("");
};
