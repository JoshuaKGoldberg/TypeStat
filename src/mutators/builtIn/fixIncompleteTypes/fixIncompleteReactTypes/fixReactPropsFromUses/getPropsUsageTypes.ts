import * as ts from "typescript";

import { AssignedTypesByName } from "../../../../../mutations/assignments";
import { getDeclaredTypesOfArgument } from "../../../../../shared/calls";
import { isNodeWithinNode } from "../../../../../shared/nodes";
import {
    isNodeWithIdentifierName,
    isPropertySignatureWithStaticName,
    PropertySignatureWithStaticName,
} from "../../../../../shared/nodeTypes";
import { getSymbolAtLocationIfNotError, getTypeAtLocationIfNotError } from "../../../../../shared/types";
import { FileMutationsRequest } from "../../../../../shared/fileMutator";
import { getComponentPropsNode, ReactComponentPropsNode } from "../getComponentPropsNode";
import { getPropNodeFromReference } from "../getPropNodeFromReference";
import { getReactComponentNode } from "../reactFiltering/getReactComponentNode";
import { ReactComponentNode } from "../reactFiltering/isReactComponentNode";

export const getPropsUsageTypes = (
    request: FileMutationsRequest,
    componentNode: ReactComponentNode,
    propsNode: ReactComponentPropsNode,
) => {
    const allAssignedTypes: AssignedTypesByName[] = [];

    for (const member of propsNode.members) {
        if (isPropertySignatureWithStaticName(member)) {
            updateAssignedTypesForReferences(request, member, componentNode, member.name, new Set(), allAssignedTypes);
        }
    }

    return allAssignedTypes;
};

const updateAssignedTypesForReferences = (
    request: FileMutationsRequest,
    member: PropertySignatureWithStaticName,
    componentNode: ReactComponentNode,
    start: ts.Node,
    seenNodes: Set<ts.Node>,
    allAssignedTypes: AssignedTypesByName[],
) => {
    // Don't repeatedly bounce back and forth between references
    if (seenNodes.has(start)) {
        return;
    }
    seenNodes.add(start);

    // Find all references to the name of the type within the component
    const references = request.fileInfoCache
        .getNodeReferencesAsNodes(start)
        ?.filter((reference) => isNodeWithinNode(request.sourceFile, reference, componentNode));
    if (references === undefined || references.length === 0) {
        return;
    }

    // For each reference, try to infer the type from its usage...
    for (const reference of references) {
        // (except for the original member we're looking around)
        if (reference === member) {
            continue;
        }

        // If the reference is an indirect storage, such as a variable, recurse on *its* references
        if (!ts.isExpression(reference)) {
            updateAssignedTypesForReferences(request, member, componentNode, reference, seenNodes, allAssignedTypes);
            continue;
        }

        const propUsage = getPropNodeFromReference(reference);

        // Case: used as the value in a JSX attribute
        if (ts.isJsxExpression(propUsage.parent)) {
            // Use the type value for the declaration of that attribute (its own prop)
            const attributePropType = getAttributePropType(request, propUsage.parent.parent);
            if (attributePropType !== undefined) {
                allAssignedTypes.push(new Map([[member.name.text, attributePropType]]));
            }

            continue;
        }

        // Case: passed as an argument to a function
        if (ts.isCallExpression(propUsage.parent) || ts.isNewExpression(propUsage.parent)) {
            const declaredTypes = getDeclaredTypesOfArgument(request, propUsage.parent, propUsage);

            for (const declaredType of declaredTypes) {
                allAssignedTypes.push(new Map([[member.name.text, declaredType]]));
            }
        }
    }
};

const getAttributePropType = (request: FileMutationsRequest, attribute: ts.Node) => {
    if (!ts.isJsxAttribute(attribute) || !isNodeWithIdentifierName(attribute)) {
        return undefined;
    }

    // Find the corresponding declaration or (containing variable) for the node's backing React component
    // In theory we could try to get the symbol or type at the location,
    // but in practice it seems that always resolves to the (potentially incomplete) provided type
    const { tagName } = attribute.parent.parent;
    const tagDeclaration = getSymbolAtLocationIfNotError(request, tagName)?.valueDeclaration;
    if (tagDeclaration === undefined) {
        return undefined;
    }

    // Get the React component associated with the declaration
    const tagComponent = getReactComponentNode(tagDeclaration);
    if (tagComponent === undefined) {
        return undefined;
    }

    // Find the props node declaration for that component,
    // and within that, the specific prop declaration
    const tagProps = getComponentPropsNode(request, tagComponent);
    const propDeclaration = tagProps?.members.find(
        (member) => isNodeWithIdentifierName(member) && member.name.text === attribute.name.text,
    );

    return getTypeAtLocationIfNotError(request, propDeclaration);
};
