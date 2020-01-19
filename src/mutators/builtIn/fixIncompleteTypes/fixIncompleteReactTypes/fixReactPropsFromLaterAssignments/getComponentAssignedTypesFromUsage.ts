import * as ts from "typescript";

import { AssignedTypesByName } from "../../../../../mutations/assignments";
import { getStaticNameOfProperty } from "../../../../../shared/names";
import { FileMutationsRequest } from "../../../../fileMutator";
import { ReactComponentNode } from "../reactFiltering/isReactComponentNode";

/**
 * Finds all assigned types for properties in each JSX usage of a React component.
 */
export const getComponentAssignedTypesFromUsage = (
    request: FileMutationsRequest,
    node: ReactComponentNode,
): AssignedTypesByName[] | undefined => {
    const references = getComponentReferences(request, node);
    if (references === undefined) {
        return undefined;
    }

    const assignedTypes: AssignedTypesByName[] = [];

    // For each referencing location, update types if the node is used as a component there
    for (const reference of references) {
        updateAssignedTypesForReference(reference, assignedTypes, request);
    }

    return assignedTypes;
};

const getComponentReferences = (request: FileMutationsRequest, node: ReactComponentNode) => {
    const referencesNode = ts.isClassDeclaration(node) || ts.isFunctionDeclaration(node) ? node : node.parent;

    return request.fileInfoCache.getNodeReferencesAsNodes(referencesNode);
};

const updateAssignedTypesForReference = (
    identifier: ts.Node,
    componentAssignedTypes: AssignedTypesByName[],
    request: FileMutationsRequest,
): void => {
    // In order to assign props, the referencing node should be an identifier...
    if (!ts.isIdentifier(identifier)) {
        return;
    }

    // ...inside a starting JSX element
    const jsxElement = identifier.parent;
    if (!ts.isJsxSelfClosingElement(jsxElement) && !ts.isJsxOpeningElement(jsxElement)) {
        return;
    }

    // For each property passed in this element's attributes, grab its name and type into a map
    const assignedTypes: AssignedTypesByName = new Map();

    for (const property of jsxElement.attributes.properties) {
        // Ignore properties that aren't directly JSX attributes
        if (!ts.isJsxAttribute(property)) {
            continue;
        }

        // For now, ignore any property with a name that's not immediately convertable to a string
        const name = getStaticNameOfProperty(property.name);
        if (name === undefined) {
            continue;
        }

        // TypeScript stores the type of the property's value on the property itself
        assignedTypes.set(name, request.services.program.getTypeChecker().getTypeAtLocation(property));
    }

    componentAssignedTypes.push(assignedTypes);
};
