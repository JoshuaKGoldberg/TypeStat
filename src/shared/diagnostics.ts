import ts from "typescript";

export type DiagnosticWithStart = {
	start: number;
} & ts.Diagnostic;

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
