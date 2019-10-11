import { IMutation } from "automutate";
import * as ts from "typescript";

import { joinAssignedTypesByName } from "../../../../mutations/assignments";
import { createTypeExpansionMutation } from "../../../../mutations/expansions/expansionMutations";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

import { collectGenericNodeReferences, InterfaceOrTypeLiteral } from "./collectGenericNodeReferences";
import { expandValuesAssignedToReferenceNodes } from "./expandValuesAssignedToReferenceNodes";

export const fixIncompleteInterfaceOrTypeLiteralGenerics: FileMutator = (request: FileMutationsRequest): readonly IMutation[] =>
    collectMutationsFromNodes(request, isInterfaceOrTypeLiteral, visitInterfaceOrTypeLiteral);

const isInterfaceOrTypeLiteral = (node: ts.Node): node is InterfaceOrTypeLiteral =>
        ts.isInterfaceDeclaration(node) || ts.isTypeLiteralNode(node),
    visitInterfaceOrTypeLiteral = (node: InterfaceOrTypeLiteral, request: FileMutationsRequest): IMutation | undefined => {
        // Find all nodes that seem like they could possibly reference the generic
        const genericReferenceNodes = collectGenericNodeReferences(request, node);
        if (genericReferenceNodes === undefined) {
            return undefined;
        }

        // Given all those generic references, find all the types being assigned to those nodes
        const originalType = request.services.program.getTypeChecker().getTypeAtLocation(node),
            valuesAssignedToReferenceNodes = expandValuesAssignedToReferenceNodes(request, originalType, genericReferenceNodes);
        if (valuesAssignedToReferenceNodes.length === 0) {
            return undefined;
        }

        // Join those types into a mapping that keys them by property name
        // That mapping is directly translatable into a mutation to add those properties
        return createTypeExpansionMutation(request, node, [joinAssignedTypesByName(request, valuesAssignedToReferenceNodes)]);
    };
