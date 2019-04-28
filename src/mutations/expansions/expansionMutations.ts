import { combineMutations, IMutation } from "automutate";
import * as ts from "typescript";

import { InterfaceOrTypeLiteral } from "../../mutators/builtIn/fixIncompleteTypes/fixIncompleteInterfaceOrTypeLiteralGenerics/collectGenericNodeReferences";
import { FileMutationsRequest } from "../../mutators/fileMutator";
import { isNotUndefined } from "../../shared/arrays";

import { addIncompleteTypesToType, TypeSummariesPerNodeByName } from "./addIncompleteTypesToType";
import { addMissingTypesToType } from "./addMissingTypesToType";
import { originalTypeHasIncompleteType } from "./eliminations";
import { summarizeAllAssignedTypes, TypeSummariesByName } from "./summarization";

export interface AssignedTypeValue {
    /**
     * Name of an added child property, if not an entirely new value literal.
     */
    name?: string;

    /**
     * Type being added as a property or set as a complete type.
     */
    type: ts.Type;
}

export type AssignedTypesByName = Map<string, ts.Type>;

/**
 * Joins a set of assigned type values into a single mapping by name.
 */
export const joinAssignedTypesByName = (request: FileMutationsRequest, assignedTypeValues: ReadonlyArray<AssignedTypeValue>) => {
    const assignedTypesByName = new Map<string, ts.Type>();

    for (const { name, type } of assignedTypeValues) {
        // If the type comes with its own name, it's for a single property
        if (name !== undefined) {
            assignedTypesByName.set(name, type);
            continue;
        }

        // Types without names are spread to convey multiple properties
        for (const property of type.getProperties()) {
            const declarations = property.getDeclarations();
            const relevantDeclaration = declarations === undefined ? property.valueDeclaration : declarations[0];
            if ((relevantDeclaration as ts.Declaration | undefined) === undefined) {
                continue;
            }

            const propertyType = request.services.program.getTypeChecker().getTypeAtLocation(relevantDeclaration);
            assignedTypesByName.set(property.name, propertyType);
        }
    }

    return assignedTypesByName;
};

/**
 * Given an interface or type declaration and a set of later-assigned types,
 * expands the original declaration to now also include the types.
 */
export const createTypeExpansionMutation = (
    request: FileMutationsRequest,
    node: InterfaceOrTypeLiteral,
    allAssignedTypes: AssignedTypesByName[],
): IMutation | undefined => {
    const originalPropertiesByName = groupPropertyDeclarationsByName(node);
    const summarizedAssignedTypes = summarizeAllAssignedTypes(request, allAssignedTypes);
    const incompleteTypes: TypeSummariesPerNodeByName = new Map();
    const missingTypes: TypeSummariesByName = new Map();

    for (const [name, summary] of summarizedAssignedTypes) {
        // If the original type doesn't have the name at all, we'll need to add it in
        const originalProperty = originalPropertiesByName.get(name);
        if (originalProperty === undefined) {
            missingTypes.set(name, summary);
            continue;
        }

        // If the type matches an existing property in name but not in type, we'll add the new type in there
        const originalPropertyType = request.services.program.getTypeChecker().getTypeAtLocation(originalProperty);
        if (originalTypeHasIncompleteType(request, originalPropertyType, summary.types)) {
            incompleteTypes.set(name, { originalProperty, summary });
        }
    }

    const incompleteTypesMutations = addIncompleteTypesToType(request, incompleteTypes);
    const missingTypesMutations = addMissingTypesToType(request, node, missingTypes);
    const mutations = [incompleteTypesMutations, missingTypesMutations].filter(isNotUndefined);

    return mutations.length === 0 ? undefined : combineMutations(...mutations);
};

const groupPropertyDeclarationsByName = (node: ts.InterfaceDeclaration | ts.TypeLiteralNode) => {
    const propertiesByName: Map<string, ts.PropertySignature> = new Map();

    for (const member of node.members) {
        if (
            !ts.isPropertySignature(member) ||
            !(ts.isIdentifier(member.name) || ts.isNumericLiteral(member.name) || ts.isStringLiteral(member.name)) ||
            member.type === undefined
        ) {
            continue;
        }

        propertiesByName.set(member.name.text, member);
    }

    return propertiesByName;
};
