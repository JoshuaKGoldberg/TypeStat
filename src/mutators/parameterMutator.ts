import { IMutation } from "automutate";
import * as ts from "typescript";

import { canNodeBeFixedForNoImplicitAny, getNoImplicitAnyMutations } from "../mutations/codeFixes";
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
    // If the property violates --noImplicitAny (has no type or initializer), this can only be a --noImplicitAny fix
    if (canNodeBeFixedForNoImplicitAny(node)) {
        return getNoImplicitAnyMutations(node, request);
    }

    // Nothing else is implemented yet for parameters :)
    return undefined;
};
