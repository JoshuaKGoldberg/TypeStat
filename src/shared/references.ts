import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { findNodeByStartingPosition } from "./nodes";

export const findRelevantNodeReferences = (request: FileMutationsRequest, node: ts.Node): ts.ReferenceEntry[] | undefined => {
    // Find all locations the containing method is referenced
    const referencedSymbols = request.services.languageService.findReferences(
        request.sourceFile.fileName,
        node.parent.getStart(request.sourceFile),
    );
    if (referencedSymbols === undefined) {
        return undefined;
    }

    const references = new Set<ts.ReferenceEntry>();

    // For each reference within the referencing symbols, add it if it's not the child of a filtered node
    for (const referenceSymbol of referencedSymbols) {
        for (const reference of referenceSymbol.references) {
            if (!referenceIsFilteredOut(request, reference)) {
                references.add(reference);
            }
        }
    }

    return Array.from(references);
};

const referenceIsFilteredOut = (request: FileMutationsRequest, reference: ts.ReferenceEntry): boolean => {
    const referencingNode: ts.Node | undefined = findNodeByStartingPosition(request.sourceFile, reference.textSpan.start);

    return isNodeFilteredOut(request, referencingNode);
};

export const isNodeFilteredOut = (request: FileMutationsRequest, node: ts.Node): boolean => {
    while (node !== undefined) {
        if (request.filteredNodes.has(node)) {
            return true;
        }

        node = node.parent;
    }

    return false;
};
