import { IMutation } from "automutate";
import * as ts from "typescript";

import { MutationPrinter } from "../printing/MutationsPrinter";
import { FileMutationsRequest } from "./findMutationsInFile";

export type MutatorSelector<TNode extends ts.Node = ts.Node> = 
    | TNode["kind"]
    | ((node: ts.Node) => node is TNode)
;

export interface NodeMutationsRequest extends FileMutationsRequest {
    readonly printer: MutationPrinter;
}

export interface MutatorMetadata<TNode extends ts.Node> {
    selector: MutatorSelector<TNode>;
}

export interface NodeMutator<TNode extends ts.Node = any> {
    readonly metadata: MutatorMetadata<TNode>;

    readonly run: (
        node: TNode,
        fileRequest: NodeMutationsRequest,
    ) => IMutation | undefined;
}
