import * as ts from "typescript";

import { LanguageServices } from "../services/language";

import { findNodeByStartingPosition } from "./nodes";

// TODO: file issue to clean up existing uses of findRelevantNodeReferences that could just use this
export const findRelevantNodeReferencesAsNodes = (
    filteredNodes: ReadonlySet<ts.Node>,
    services: LanguageServices,
    sourceFile: ts.SourceFile,
    identifyingNode: ts.Node,
): ts.Node[] | undefined => {
    const references = findRelevantNodeReferences(filteredNodes, services, sourceFile, identifyingNode);
    if (references === undefined) {
        return undefined;
    }

    const referencingNodes: ts.Node[] = [];

    for (const reference of references) {
        // Grab the source file containing the reference
        const referencingSourceFile = services.program.getSourceFile(reference.fileName);
        if (referencingSourceFile === undefined) {
            continue;
        }

        // Find the referencing node from its place in the source file, unless it's roughly the original node
        const referencingNode = findNodeByStartingPosition(referencingSourceFile, reference.textSpan.start);
        if (referencingNode === undefined || referencingNode === identifyingNode || referencingNode === identifyingNode) {
            continue;
        }

        referencingNodes.push(referencingNode);
    }

    return referencingNodes;
};

const findRelevantNodeReferences = (
    filteredNodes: ReadonlySet<ts.Node>,
    services: LanguageServices,
    sourceFile: ts.SourceFile,
    node: ts.Node,
): ts.ReferenceEntry[] | undefined => {
    // Find all locations the containing method is referenced
    const referencedSymbols = services.languageService.findReferences(sourceFile.fileName, node.getStart(sourceFile));
    if (referencedSymbols === undefined) {
        return undefined;
    }

    const references = new Set<ts.ReferenceEntry>();

    // For each reference within the referencing symbols, add it if it's not the child of a filtered node
    for (const referenceSymbol of referencedSymbols) {
        for (const reference of referenceSymbol.references) {
            const referencingSourceFile = services.program.getSourceFile(reference.fileName);
            if (referencingSourceFile === undefined) {
                continue;
            }

            if (!referenceIsFilteredOut(filteredNodes, referencingSourceFile, reference)) {
                references.add(reference);
            }
        }
    }

    return Array.from(references);
};

const referenceIsFilteredOut = (filteredNodes: ReadonlySet<ts.Node>, sourceFile: ts.SourceFile, reference: ts.ReferenceEntry): boolean => {
    return isNodeFilteredOut(filteredNodes, findNodeByStartingPosition(sourceFile, reference.textSpan.start));
};

export const isNodeFilteredOut = (filteredNodes: ReadonlySet<ts.Node>, node: ts.Node | undefined): boolean => {
    while (node !== undefined) {
        if (filteredNodes.has(node)) {
            return true;
        }

        node = node.parent;
    }

    return false;
};
