import * as ts from "typescript";

import { FileMutationsRequest } from "../../shared/fileMutator.js";

/**
 * Uses a requesting language service to get code fixes for a type of node.
 * TypeScript's `getCodeFixesAtPosition` API doesn't check whether the diagnostic actually is being
 * emitted for the node. So we must.
 * @param request   Source file, metadata, and settings to collect mutations in the file.
 * @param node   Requesting node to retrieve fixes on.
 * @param errorCodes   Diagnostic codes to retrieve matched fixes for.
 */
export const getCodeFixIfMatchedByDiagnostic = (
	request: FileMutationsRequest,
	node: ts.Node,
	errorCodes: number[],
) => {
	const semanticDiagnostics =
		request.services.languageService.getSemanticDiagnostics(
			request.sourceFile.fileName,
		);
	if (
		!semanticDiagnostics.some(
			(diagnostic) =>
				errorCodes.includes(diagnostic.code) &&
				diagnostic.start &&
				diagnostic.length &&
				diagnostic.start >= node.pos &&
				diagnostic.start + diagnostic.length <= node.end,
		)
	) {
		return undefined;
	}

	return request.services.languageService.getCodeFixesAtPosition(
		request.sourceFile.fileName,
		node.getStart(request.sourceFile),
		node.end,
		errorCodes,
		{ insertSpaceBeforeAndAfterBinaryOperators: true },
		{},
	);
};
