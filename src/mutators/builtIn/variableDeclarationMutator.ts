import { IMutation } from "automutate";
import * as ts from "typescript";

import { canNodeBeFixedForNoImplicitAny, getNoImplicitAnyMutations } from "../../mutations/codeFixes/noImplicitAny";
import { collectMutationsFromNodes } from "../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../fileMutator";
import { fixVariableIncompleteType } from "./variableDeclarations/fixVariableIncompleteType";

export const variableDeclarationMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    // This mutator fixes only for --noImplicitAny or incomplete types
    if (!request.options.fixes.incompleteTypes && !request.options.fixes.noImplicitAny) {
        return [];
    }

    return collectMutationsFromNodes(request, isNodeVisitableVariableDeclaration, visitVariableDeclaration);
};

const isNodeVisitableVariableDeclaration = (node: ts.Node): node is ts.VariableDeclaration =>
    ts.isVariableDeclaration(node) &&
    // Binding patterns are all implicitly typed, so ignore them
    !(ts.isArrayBindingPattern(node.name) || ts.isObjectBindingPattern(node.name)) &&
    // For-in and for-of loop varibles cannot have types, so don't bother trying to add them
    !ts.isForInStatement(node.parent.parent) &&
    !ts.isForOfStatement(node.parent.parent);

const visitVariableDeclaration = (node: ts.VariableDeclaration, request: FileMutationsRequest): IMutation | undefined => {
    // If the variable violates --noImplicitAny (has no type or initializer), this can only be a --noImplicitAny fix
    if (canNodeBeFixedForNoImplicitAny(node)) {
        return getNoImplicitAnyMutations(node, request);
    }

    // If we fix for incomplete types, try to add them in
    if (request.options.fixes.incompleteTypes) {
        const incompleteTypeFix = fixVariableIncompleteType(request, node);
        if (incompleteTypeFix !== undefined) {
            return incompleteTypeFix;
        }
    }

    return undefined;
};
