import { IMutation } from "automutate";
import * as ts from "typescript";

import { createCodeFixAdditionMutation, getNoImplicitAnyCodeFixes } from "../mutations/codeFixes";
import { FileMutationsRequest, FileMutator } from "./fileMutator";

export const parameterMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    const mutations: IMutation[] = [];

    const visitNode = (node: ts.Node) => {
        if (ts.isParameter(node)) {
            const mutation = visitParameterDeclaration(node, request);
            if (mutation !== undefined) {
                mutations.push(mutation);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(request.sourceFile, visitNode);

    return mutations;
};

const visitParameterDeclaration = (node: ts.ParameterDeclaration, request: FileMutationsRequest): IMutation | undefined => {
    // If the parameter violates --noImplicitAny and we fix for that, apply a suggested code fix if we get one
    if (request.options.fixes.noImplicitAny) {
        const codeFixes = getNoImplicitAnyCodeFixes(node, request);
        if (codeFixes.length !== 0) {
            return createCodeFixAdditionMutation(codeFixes);
        }
    }

    // Nothing else is implemented yet for parameters :)
    return undefined;
};
