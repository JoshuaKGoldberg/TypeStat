import * as ts from "typescript";

import { FileMutationsRequest } from "../../../fileMutator";

export const collectTypeParameterReferences = (request: FileMutationsRequest, baseTypeParameter: ts.Node) => {
    const directReferences = request.fileInfoCache.getNodeReferencesAsNodes(baseTypeParameter);
    if (directReferences === undefined) {
        return undefined;
    }

    return expandReferencesForParameterTypes(request, directReferences);
};

const expandReferencesForParameterTypes = (request: FileMutationsRequest, referencingNodes: readonly ts.Node[]) => {
    const expandedReferences: ts.Node[] = [];

    for (const referencingNode of referencingNodes) {
        const { parent } = referencingNode;
        const expandedParentReferences = findParentExpandedReferences(request, parent);
        if (expandedParentReferences !== undefined) {
            expandedReferences.push(...expandedParentReferences);
            break;
        }
    }

    return expandedReferences;
};

const findParentExpandedReferences = (request: FileMutationsRequest, parent: ts.Node) => {
    if (
        ts.isPropertyDeclaration(parent) ||
        ts.isVariableDeclaration(parent) ||
        ts.isPropertyDeclaration(parent) ||
        ts.isParameterPropertyDeclaration(parent, parent.parent)
    ) {
        return request.fileInfoCache.getNodeReferencesAsNodes(parent);
    }

    return undefined;
};
