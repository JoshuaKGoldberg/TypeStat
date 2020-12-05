import * as tsutils from "tsutils";
import * as ts from "typescript";

import { LanguageServices } from "../services/language";

import { findRelevantNodeReferencesAsNodes } from "./references";

export class FileInfoCache {
    private readonly nodeReferences = new Map<ts.Node, ReadonlyArray<ts.Node> | undefined>();
    private variableUsage: ReadonlyMap<ts.Identifier, tsutils.VariableInfo> | undefined;

    public constructor(
        private readonly filteredNodes: ReadonlySet<ts.Node>,
        private readonly services: LanguageServices,
        private readonly sourceFile: ts.SourceFile,
    ) {}

    /**
     * @returns All corresponding nodes for the reference entries for a node.
     */
    public getNodeReferencesAsNodes(node: ts.Node): ReadonlyArray<ts.Node> | undefined {
        let references = this.nodeReferences.get(node);

        if (references === undefined) {
            references = findRelevantNodeReferencesAsNodes(this.filteredNodes, this.services, node);
            this.nodeReferences.set(node, references);
        }

        return references;
    }

    public getVariableUsage(): ReadonlyMap<ts.Identifier, tsutils.VariableInfo> {
        if (this.variableUsage === undefined) {
            this.variableUsage = tsutils.collectVariableUsage(this.sourceFile);
        }

        return this.variableUsage;
    }
}
