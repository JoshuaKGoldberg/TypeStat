import { combineMutations, IMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

import { addIncompleteTypesToType, TypeSummariesPerNodeByName } from "./addIncompleteTypesToType";
import { addMissingTypesToType } from "./addMissingTypesToType";
import { originalTypeHasIncompleteType } from "./eliminations";
import { summarizeAllAssignedTypes, TypeSummariesByName } from "./summarization";

export type AssignedTypesByName = Map<string, ts.Type>;

/**
 * Given an interface or type declaration and a set of later-assigned types,
 * expands the original declaration to now also include the types.
 */
export const createTypeExpansionMutation = (
    request: FileMutationsRequest,
    node: ts.InterfaceDeclaration | ts.TypeLiteralNode,
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

    const mutations = [addIncompleteTypesToType(request, incompleteTypes), addMissingTypesToType(request, node, missingTypes)].filter(
        (mutation): mutation is IMutation => mutation !== undefined,
    );

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
