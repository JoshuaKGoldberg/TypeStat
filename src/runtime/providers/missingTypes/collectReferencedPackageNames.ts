import { isBuiltin } from "node:module";
import ts from "typescript";

import { LanguageServices } from "../../../services/language.js";

export const collectReferencedPackageNames = (
	services: LanguageServices,
	ignoredPackages: ReadonlySet<string>,
) => {
	const packageNames = new Set<string>();

	for (const sourceFile of services.program.getSourceFiles()) {
		const collected = collectFileReferencedPackageNames(
			sourceFile,
			ignoredPackages,
		);
		for (const packageName of collected) {
			packageNames.add(packageName);
		}
	}

	return packageNames;
};

const collectFileReferencedPackageNames = (
	sourceFile: ts.SourceFile,
	ignoredPackages: ReadonlySet<string>,
) => {
	const packageNames = new Set<string>();

	const visitNode = (node: ts.Node) => {
		const packageName = parsePackageNameFromNode(node);

		if (
			packageName !== undefined &&
			!isBuiltin(packageName) &&
			!ignoredPackages.has(packageName)
		) {
			packageNames.add(packageName);
		}

		ts.forEachChild(node, visitNode);
	};

	ts.forEachChild(sourceFile, visitNode);

	return packageNames;
};

const parsePackageNameFromNode = (node: ts.Node) => {
	if (
		ts.isIdentifier(node) &&
		(node.text === "module" || node.text === "process")
	) {
		return "node";
	}

	if (ts.isImportDeclaration(node)) {
		return parseImportDeclarationPackageName(node);
	}

	if (ts.isImportEqualsDeclaration(node)) {
		return parseImportEqualsDeclarationPackageName(node);
	}

	if (ts.isCallExpression(node)) {
		return parseCallExpressionPackageName(node);
	}

	return undefined;
};

const parseImportDeclarationPackageName = (node: ts.ImportDeclaration) =>
	parseModuleSpecifier(node.moduleSpecifier);

const parseImportEqualsDeclarationPackageName = (
	node: ts.ImportEqualsDeclaration,
) => {
	const { moduleReference } = node;
	if (!ts.isExternalModuleReference(moduleReference)) {
		return undefined;
	}

	return parseModuleSpecifier(moduleReference.expression);
};

const parseCallExpressionPackageName = (node: ts.CallExpression) => {
	if (
		!ts.isIdentifier(node.expression) ||
		(node.expression.text !== "import" && node.expression.text !== "require") ||
		node.arguments.length !== 1
	) {
		return undefined;
	}

	const firstArgument = node.arguments[0];
	if (!ts.isStringLiteral(firstArgument)) {
		return undefined;
	}

	return parseModuleSpecifier(firstArgument);
};

const parseModuleSpecifier = (node: ts.Expression) => {
	if (!ts.isStringLiteral(node)) {
		return undefined;
	}

	const { text } = node;
	if (/[aZ]/.exec(text[0]) === null) {
		return undefined;
	}

	return text.split("/")[0];
};
