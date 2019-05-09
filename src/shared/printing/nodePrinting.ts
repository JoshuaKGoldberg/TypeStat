import { TypeSummariesByName, TypeSummary } from "../../mutations/expansions/summarization";
import { createTypeName } from "../../mutations/aliasing";
import { FileMutationsRequest } from "../../mutators/fileMutator";

import { printNewLine } from "./newlines";

export const printNamedTypeSummaries = (request: FileMutationsRequest, typeSummaries: TypeSummariesByName): string => {
    return Array.from(typeSummaries)
        .map(([typeName, typeSummary]) => printNamedTypeSummary(request, typeName, typeSummary))
        .join("");
};

export const printNamedTypeSummary = (request: FileMutationsRequest, name: string, summary: TypeSummary): string => {
    return [
        name,
        summary.alwaysProvided ? "?: " : ": ",
        createTypeName(request, ...summary.types),
        ";",
        printNewLine(request.options.compilerOptions),
    ].join("");
};
