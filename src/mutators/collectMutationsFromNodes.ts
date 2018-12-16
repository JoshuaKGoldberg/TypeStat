import { IMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "./fileMutator";

export const collectMutationsFromNodes = <TNode extends ts.Node>(
    request: FileMutationsRequest,
    selector: (node: ts.Node) => node is TNode,
    visitor: (node: TNode, request: FileMutationsRequest) => Readonly<IMutation> | undefined,
) => {
    const mutations: IMutation[] = [];

    const visitNode = (node: ts.Node) => {
        if (selector(node)) {
            const mutation = visitor(node, request);

            if (mutation !== undefined) {
                mutations.push(mutation);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(request.sourceFile, visitNode);

    return mutations;
};
