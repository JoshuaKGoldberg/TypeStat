import * as ts from "typescript";

import { IMutation } from "automutate";
import { getNoImplicitThisMutations } from "../mutations/codeFixes/noImplicitThis";
import { FileMutationsRequest, FileMutator } from "./fileMutator";

export const functionThisMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    const mutations: IMutation[] = [];

    const visitNode = (node: ts.Node) => {
        if (ts.isFunctionDeclaration(node)) {
            const mutation = visitFunctionDeclaration(node, request);
            if (mutation !== undefined) {
                mutations.push(mutation);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(request.sourceFile, visitNode);

    return mutations;
};

const visitFunctionDeclaration = (node: ts.FunctionDeclaration, request: FileMutationsRequest): IMutation | undefined => 
    request.options.fixes.noImplicitThis
        ? getNoImplicitThisMutations(node, request)
        : undefined;
