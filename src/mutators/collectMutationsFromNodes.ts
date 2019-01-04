import { IMutation } from "automutate";
import * as ts from "typescript";

import { getQuickErrorSummary } from "../shared/errors";
import { NodeSelector } from "../shared/nodeTypes";
import { FileMutationsRequest } from "./fileMutator";

export type NodeVisitor<TNode extends ts.Node> = (node: TNode, request: FileMutationsRequest) => Readonly<IMutation> | undefined;

export const collectMutationsFromNodes = <TNode extends ts.Node>(
    request: FileMutationsRequest,
    selector: NodeSelector<TNode>,
    visitor: NodeVisitor<TNode>,
) => {
    const mutations: IMutation[] = [];

    const visitNode = (node: ts.Node) => {
        if (request.filteredNodes.has(node)) {
            return;
        }

        if (selector(node)) {
            const mutation = tryGetMutation(request, node, visitor);

            if (mutation !== undefined) {
                mutations.push(mutation);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(request.sourceFile, visitNode);

    return mutations;
};

const tryGetMutation = <TNode extends ts.Node>(request: FileMutationsRequest, node: TNode, visitor: NodeVisitor<TNode>) => {
    try {
        return visitor(node, request);
    } catch (error) {
        request.options.logger.stderr.write(`\nError in ${request.sourceFile.fileName} at node '${node.getText(request.sourceFile)}':\n\t`);
        request.options.logger.stderr.write(getQuickErrorSummary(error));
        request.options.logger.stderr.write("\n\n");
    }

    return undefined;
};
