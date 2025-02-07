import ts from "typescript";

import { FileMutationsRequest } from "../../shared/fileMutator.js";
import { printNewLine } from "../../shared/printing/newlines.js";
import { printNamedTypeSummaries } from "../../shared/printing/nodePrinting.js";
import { TypeSummariesByName } from "../expansions/summarization.js";

export const createDeclarationForTypeSummaries = (
	request: FileMutationsRequest,
	enclosingDeclaration: ts.Node | undefined,
	name: string,
	typeSummaries: TypeSummariesByName,
) => {
	const printedSummaries = printNamedTypeSummaries(
		request,
		enclosingDeclaration,
		typeSummaries,
	);
	const newLine = printNewLine(request.options.parsedTsConfig.options);

	return [`type ${name} = {`, newLine, printedSummaries, `};`].join("");
};
