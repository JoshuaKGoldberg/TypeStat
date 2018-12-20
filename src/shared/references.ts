import * as ts from "typescript";

import { LanguageServices } from "../services/language";
import { findNodeByStartingPosition } from "./nodes";

export const findRelevantNodeReferences = (
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
            if (!referenceIsFilteredOut(filteredNodes, sourceFile, reference)) {
                references.add(reference);
            }
        }
    }

    return Array.from(references);
};

const referenceIsFilteredOut = (filteredNodes: ReadonlySet<ts.Node>, sourceFile: ts.SourceFile, reference: ts.ReferenceEntry): boolean => {
    return isNodeFilteredOut(filteredNodes, findNodeByStartingPosition(sourceFile, reference.textSpan.start));
};

export const isNodeFilteredOut = (filteredNodes: ReadonlySet<ts.Node>, node: ts.Node): boolean => {
    while (node !== undefined) {
        if (filteredNodes.has(node)) {
            return true;
        }

        node = node.parent;
    }

    return false;
};
