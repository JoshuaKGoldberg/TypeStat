import { IMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "./findMutationsInFile";

export type MutatorSelector<TNode extends ts.Node = ts.Node> = 
    | TNode["kind"]
    | ((node: ts.Node) => node is TNode)
;

export interface MutatorMetadata<TNode extends ts.Node> {
    selector: MutatorSelector<TNode>;
}

export interface Mutator<TNode extends ts.Node = any> {
    readonly metadata: MutatorMetadata<TNode>;

    readonly run: (
        node: TNode,
        request: FileMutationsRequest,
    ) => IMutation | undefined;
}
