import * as ts from "typescript";

import { LanguageServices } from "../services/language";

import { findNodeByStartingPosition } from "./nodes";

export const isNodeFilteredOut = (filteredNodes: ReadonlySet<ts.Node>, node: ts.Node | undefined): boolean => {
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

        // Find the referencing node from its place in that source file, unless it's the original node
        const referencingNode = findNodeByStartingPosition(referencingSourceFile, reference.textSpan.start);
        if (referencingNode === identifyingNode) {
            continue;
        }

        referencingNodes.push(referencingNode);
    }

    return referencingNodes;
};

const referenceIsFilteredOut = (filteredNodes: ReadonlySet<ts.Node>, sourceFile: ts.SourceFile, reference: ts.ReferenceEntry): boolean => {
        return isNodeFilteredOut(filteredNodes, findNodeByStartingPosition(sourceFile, reference.textSpan.start));
    },
    findRelevantNodeReferences = (
        filteredNodes: ReadonlySet<ts.Node>,
        services: LanguageServices,
        sourceFile: ts.SourceFile,
        node: ts.Node,
    ): ts.ReferenceEntry[] | undefined => {
        // Find all locations the node is referenced
        const referencedSymbols = services.languageService.findReferences(sourceFile.fileName, node.getStart(sourceFile));
        if (referencedSymbols === undefined) {
            return undefined;
        }

        const references = new Set<ts.ReferenceEntry>();

        // For each reference within the referencing symbols, add it if it's not the child of a filtered node or a .d.ts file
        for (const referenceSymbol of referencedSymbols) {
            for (const reference of referenceSymbol.references) {
                // Grab the source file containing the reference
                const referencingSourceFile = services.program.getSourceFile(reference.fileName);
                if (referencingSourceFile === undefined || referencingSourceFile.isDeclarationFile) {
                    continue;
                }

                // Add the reference if it's not a child of nodes we filter out
                if (!referenceIsFilteredOut(filteredNodes, referencingSourceFile, reference)) {
                    references.add(reference);
                }
            }
        }

        return Array.from(references);
    };
