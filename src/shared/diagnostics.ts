import ts from "typescript";

export type DiagnosticWithStart = ts.Diagnostic & {
	start: number;
};

export const isDiagnosticWithStart = (
	diagnostic: ts.Diagnostic,
): diagnostic is DiagnosticWithStart => {
	return !!diagnostic.start;
};

export const getLineForDiagnostic = (
	diagnostic: DiagnosticWithStart,
	sourceFile: ts.SourceFile,
) => {
	return ts.getLineAndCharacterOfPosition(sourceFile, diagnostic.start).line;
};

export const stringifyDiagnosticMessageText = (diagnostic: ts.Diagnostic) => {
	return typeof diagnostic.messageText === "string"
		? diagnostic.messageText
		: diagnostic.messageText.messageText;
};

export const userFriendlyDiagnosticMessageText = (
	diagnostic: ts.Diagnostic,
	currentDir: string,
) => {
	const diagnosticMessage = stringifyDiagnosticMessageText(diagnostic);
	if (diagnostic.code === 1192 || diagnostic.code === 1259) {
		// = Module_0_can_only_be_default_imported_using_the_1_flag
		return diagnosticMessage.replace(
			/Module '"[^"]*"' (can only be default-imported|has no default export)/,
			"This module $1",
		);
	} else {
		return diagnosticMessage.replace(currentDir, "<rootDir>");
	}
};
