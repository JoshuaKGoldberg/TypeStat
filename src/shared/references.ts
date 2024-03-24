import ts from "typescript";

import { LanguageServices } from "../services/language.js";
import { findNodeByStartingPosition } from "./nodes.js";

export const isNodeFilteredOut = (
	filteredNodes: ReadonlySet<ts.Node>,
	node: ts.Node | undefined,
): boolean => {
	while (node !== undefined) {
		if (filteredNodes.has(node)) {
			return true;
		}

		node = node.parent;
	}

	return false;
};

export const findRelevantNodeReferencesAsNodes = (
	filteredNodes: ReadonlySet<ts.Node>,
	services: LanguageServices,
	identifyingNode: ts.Node,
): ts.Node[] | undefined => {
	const references = findRelevantNodeReferences(
		filteredNodes,
		services,
		identifyingNode,
	);
	if (references === undefined) {
		return undefined;
	}

	const referencingNodes: ts.Node[] = [];

	for (const reference of references) {
		// Grab the source file containing the reference
		const referencingSourceFile = services.program.getSourceFile(
			reference.fileName,
		);
		if (referencingSourceFile === undefined) {
			continue;
		}

		// Find the referencing node from its place in that source file, unless it's the original node
		const referencingNode = findNodeByStartingPosition(
			referencingSourceFile,
			reference.textSpan.start,
		);
		if (referencingNode === undefined || referencingNode === identifyingNode) {
			continue;
		}

		referencingNodes.push(referencingNode);
	}

	return referencingNodes;
};

const referenceIsFilteredOut = (
	filteredNodes: ReadonlySet<ts.Node>,
	sourceFile: ts.SourceFile,
	reference: ts.ReferenceEntry,
): boolean => {
	return isNodeFilteredOut(
		filteredNodes,
		findNodeByStartingPosition(sourceFile, reference.textSpan.start),
	);
};

const findRelevantNodeReferences = (
	filteredNodes: ReadonlySet<ts.Node>,
	services: LanguageServices,
	node: ts.Node,
): ts.ReferenceEntry[] | undefined => {
	// Find all locations the node is referenced
	const referencedSymbols = findReferencesForNormalizedFileName(services, node);
	if (referencedSymbols === undefined) {
		return undefined;
	}

	const references = new Set<ts.ReferenceEntry>();

	// For each reference within the referencing symbols, add it if it's not the child of a filtered node
	for (const referenceSymbol of referencedSymbols) {
		for (const reference of referenceSymbol.references) {
			// Add the reference if it's not a child of nodes we filter out
			const referencingSourceFile = services.program.getSourceFile(
				reference.fileName,
			);
			if (
				referencingSourceFile !== undefined &&
				!referenceIsFilteredOut(filteredNodes, referencingSourceFile, reference)
			) {
				references.add(reference);
			}
		}
	}

	return Array.from(references);
};

function findReferencesForNormalizedFileName(
	services: LanguageServices,
	node: ts.Node,
) {
	const nodeSourceFile = node.getSourceFile();
	try {
		return services.languageService.findReferences(
			// TypeScript stores pnpm-resolved node_modules under non-pnpm paths.
			nodeSourceFile.fileName.replace(
				/node_modules\/\.pnpm\/.+\/node_modules/,
				"node_modules",
			),
			node.getStart(nodeSourceFile),
		);
	} catch {
		return services.languageService.findReferences(
			nodeSourceFile.fileName,
			node.getStart(nodeSourceFile),
		);
	}
}
