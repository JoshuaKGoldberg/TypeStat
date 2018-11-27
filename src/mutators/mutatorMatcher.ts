import * as ts from "typescript";

import { MutatorSelector, NodeMutator } from "../runtime/mutator";

export class MutatorMatcher {
    private readonly cache = new Map<ts.SyntaxKind, ReadonlyArray<NodeMutator>>();

    public constructor(
        private readonly allMutators: ReadonlyArray<NodeMutator>,
    ) { }

    public getMutators(node: ts.Node): ReadonlyArray<NodeMutator> {
        let cached = this.cache.get(node.kind);

        if (cached === undefined) {
            cached = this.createMutatorsCache(node);
            this.cache.set(node.kind, cached);
        }

        return cached;
    }

    private createMutatorsCache(node: ts.Node): ReadonlyArray<NodeMutator> {
        const mutators: NodeMutator[] = [];

        for (const mutator of this.allMutators) {
            // tslint:disable-next-line:no-unsafe-any
            if (selectorMatchesKind(mutator.metadata.selector, node)) {
                mutators.push(mutator);
            }
        }

        return mutators;
    }
}

const selectorMatchesKind = (selector: MutatorSelector, node: ts.Node) =>
    typeof selector === "number"
        ? selector === node.kind
        : selector(node);
