import * as ts from "typescript";

import { Mutator, MutatorSelector } from "../runtime/mutator";

export class MutatorMatcher {
    private readonly cache = new Map<ts.SyntaxKind, ReadonlyArray<Mutator>>();

    public constructor(
        private readonly allMutators: ReadonlyArray<Mutator>,
    ) { }

    public getMutators(node: ts.Node): ReadonlyArray<Mutator> {
        let cached = this.cache.get(node.kind);

        if (cached === undefined) {
            cached = this.createMutatorsCache(node);
            this.cache.set(node.kind, cached);
        }

        return cached;
    }

    private createMutatorsCache(node: ts.Node): ReadonlyArray<Mutator> {
        const mutators: Mutator[] = [];

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
