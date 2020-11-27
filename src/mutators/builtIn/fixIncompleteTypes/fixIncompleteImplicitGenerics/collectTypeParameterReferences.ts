import * as tsutils from "tsutils";
import * as ts from "typescript";

import { isNotUndefined } from "../../../../shared/arrays";
import { getExpressionWithin } from "../../../../shared/nodes";
import { FileMutationsRequest } from "../../../fileMutator";

/**
 * Finds all the nodes that could indicate the type of a base type parameter,
 * by finding all references to the class's declaration nodes of that type parameter.
 */
export const collectTypeParameterReferences = (request: FileMutationsRequest, baseTypeParameter: ts.Node) => {
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
            // break;
        }
    }

    return expandedReferences;
};

const findParentExpandedReferences = (request: FileMutationsRequest, node: ts.Node) => {
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
            .filter(ts.isCallOrNewExpression)
            .map((call) => call.arguments?.[parentIndex])
            .filter(isNotUndefined);
    }

    return undefined;
};
