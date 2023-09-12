import * as path from "path";
import * as ts from "typescript";

export type ExportOrImportDeclaration =
	| ts.ExportDeclaration
	| ts.ImportDeclaration;

export type ExtensionlessExportOrImport = ExportOrImportDeclaration & {
	moduleSpecifier: ts.StringLiteral;
};

export const isExtensionlessExportOrImport = (
	node: ts.Node,
): node is ExtensionlessExportOrImport => {
	return (
		(ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
		node.moduleSpecifier !== undefined &&
		ts.isStringLiteral(node.moduleSpecifier) &&
		!path.basename(node.moduleSpecifier.text).includes(".")
	);
};
