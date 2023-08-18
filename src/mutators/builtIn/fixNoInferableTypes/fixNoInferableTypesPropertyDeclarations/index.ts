import { Mutation } from "automutate";
import * as ts from "typescript";

import { createTypeRemovalMutation } from "../../../../mutations/removals";
import { declaredInitializedTypeNodeIsRedundant } from "../../../../shared/comparisons";
import { isNodeWithType, NodeWithType } from "../../../../shared/nodeTypes";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../../shared/fileMutator";

type InferablePropertyDeclaration = ts.PropertyDeclaration & NodeWithType & Required<Pick<ts.PropertyDeclaration, "initializer">>;

export const fixNoInferableTypesPropertyDeclarations: FileMutator = (request: FileMutationsRequest): ReadonlyArray<Mutation> =>
    collectMutationsFromNodes(request, isInferableTypeCapablePropertyDeclaration, getNoInferableTypePropertyDeclarationMutation);

const isInferableTypeCapablePropertyDeclaration = (node: ts.Node): node is InferablePropertyDeclaration =>
    ts.isPropertyDeclaration(node) && isNodeWithType(node) && node.initializer !== undefined;

const getNoInferableTypePropertyDeclarationMutation = (node: InferablePropertyDeclaration, request: FileMutationsRequest) => {
    if (!declaredInitializedTypeNodeIsRedundant(request, node.type, node.initializer)) {
        return undefined;
    }

    return createTypeRemovalMutation(request, node);
};
