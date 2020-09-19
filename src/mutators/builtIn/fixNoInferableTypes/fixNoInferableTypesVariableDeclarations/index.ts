import { IMutation } from "automutate";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { createTypeRemovalMutation } from "../../../../mutations/removals";
import { declaredInitializedTypeNodeIsRedundant } from "../../../../shared/comparisons";
import { isNodeWithType, NodeWithType } from "../../../../shared/nodeTypes";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

type InferableVariableDeclaration = ts.VariableDeclaration &
    NodeWithType &
    Required<Pick<ts.VariableDeclaration, "initializer">> & {
        parent: ts.VariableDeclarationList;
    };

export const fixNoInferableTypesVariableDeclarations: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> =>
    collectMutationsFromNodes(request, isInferableTypeCapableVariableDeclaration, getNoInferableTypeVariableDeclarationMutation);

const isInferableTypeCapableVariableDeclaration = (node: ts.Node): node is InferableVariableDeclaration =>
    ts.isVariableDeclaration(node) && isNodeWithType(node) && node.initializer !== undefined && ts.isVariableDeclarationList(node.parent);

const getNoInferableTypeVariableDeclarationMutation = (node: InferableVariableDeclaration, request: FileMutationsRequest) => {
    if (
        // `const` variables should always have their declarations removed
        tsutils.isNodeFlagSet(node.parent, ts.NodeFlags.Const) ||
        // `let` variables should have only uninformative declarations removed
        declaredInitializedTypeNodeIsRedundant(request, node.type, node.initializer)
    ) {
        return createTypeRemovalMutation(request, node);
    }

    return undefined;
};
