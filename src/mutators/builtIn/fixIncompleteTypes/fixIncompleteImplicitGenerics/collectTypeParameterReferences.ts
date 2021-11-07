import * as ts from "typescript";

import { isNotUndefined } from "../../../../shared/arrays";
import { getCloseAncestorCallOrNewExpression, getExpressionWithin } from "../../../../shared/nodes";
import { FileMutationsRequest } from "../../../fileMutator";

/**
 * Finds all the nodes that could indicate the type of a base type parameter,
 * by finding all references to the class's declaration nodes of that type parameter.
 */
export const collectTypeParameterReferences = (
    request: FileMutationsRequest,
    childClass: ts.Node,
    baseClass: ts.Node,
    baseTypeParameter: ts.Node,
) => {
    // Find nodes that reference (and therefore indicate type information for) the base type
    const referencingNodes = request.fileInfoCache.getNodeReferencesAsNodes(baseTypeParameter);
    if (referencingNodes === undefined) {
        return undefined;
    }

    const expandedReferences: ts.Node[] = [];

    // For each node, find *its* references to see what types it may be
    for (const referencingNode of referencingNodes) {
        const { parent } = referencingNode;
        const expandedParentReferences = findParentExpandedReferences(request, parent);
        if (expandedParentReferences !== undefined) {
            expandedReferences.push(...expandedParentReferences);
        }
    }

    return expandedReferences;
};

const findParentExpandedReferences = (request: FileMutationsRequest, node: ts.Node) => {
    node = getEquivalentContainingTypeNode(node);

    // Property and variable declarations can be directly searched for as references
    if (ts.isParameterPropertyDeclaration(node, node.parent) || ts.isPropertyDeclaration(node) || ts.isVariableDeclaration(node)) {
        return request.fileInfoCache.getNodeReferencesAsNodes(node);
    }

    // Parameters need to check the equivalent index of their function's calls
    if (ts.isParameter(node) && ts.isFunctionLike(node.parent)) {
        const calls = request.fileInfoCache.getNodeReferencesAsNodes(node.parent);
        if (calls === undefined) {
            return undefined;
        }

        const parentIndex = node.parent.parameters.indexOf(node);
        return calls
            .map(getExpressionWithin)
            .map(getCloseAncestorCallOrNewExpression)
            .filter(isNotUndefined)
            .map((call) => call.arguments?.[parentIndex])
            .filter(isNotUndefined);
    }

    return undefined;
};

const getEquivalentContainingTypeNode = (node: ts.Node) => {
    while (ts.isIntersectionTypeNode(node.parent)) {
        node = node.parent.parent;
    }

    return node;
};
