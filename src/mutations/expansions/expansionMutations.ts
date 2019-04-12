import { combineMutations, IMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

import { addIncompleteTypesToType } from "./addIncompleteTypesToType";
import { addMissingTypesToType } from "./addMissingTypesToType";
import { deduplicatePropertiesAsTypes, originalTypeHasIncompleteType, TypesByName, TypesAndNodesByName } from "./eliminations";

export const createTypeExpansionMutation = (
    request: FileMutationsRequest,
    node: ts.InterfaceDeclaration | ts.TypeLiteralNode,
    originalType: ts.Type,
    assignedTypes: ReadonlyArray<ts.Type>,
): IMutation | undefined => {
    const assignedProperties = assignedTypes.reduce<ts.Symbol[]>((prev, next) => prev.concat(next.getProperties()), []);

    return createPropertiesExpansionMutation(request, node, originalType, assignedProperties);
};

export const createPropertiesExpansionMutation = (
    request: FileMutationsRequest,
    node: ts.InterfaceDeclaration | ts.TypeLiteralNode,
    originalType: ts.Type,
    assignedProperties: ReadonlyArray<ts.Symbol>,
): IMutation | undefined => {
    const incompleteTypes: TypesAndNodesByName = new Map();
    const missingTypes: TypesByName = new Map();

    for (const [name, assignedTypes] of deduplicatePropertiesAsTypes(request, assignedProperties)) {
        // If the original type doesn't have the name at all, we'll need to add it in
        if (originalType.getProperty(name) === undefined) {
            missingTypes.set(name, assignedTypes);
            continue;
        }

        // If the type matches an existing property in name but not in type, we'll add the new type in there
        if (originalTypeHasIncompleteType(request, originalType, assignedTypes)) {
            incompleteTypes.set(name, {
                memberNode: originalType.symbol.valueDeclaration as ts.PropertySignature,
                types: assignedTypes,
            });
        }
    }

    const mutations = [addIncompleteTypesToType(incompleteTypes), addMissingTypesToType(node, missingTypes)].filter(
        (mutation): mutation is IMutation => mutation !== undefined,
    );

    return mutations.length === 0 ? undefined : combineMutations(...mutations);
};
