import * as tsutils from "tsutils";
import * as ts from "typescript";

import { LanguageServices } from "../services/language";

import { findRelevantNodeReferences, findRelevantNodeReferencesAsNodes } from "./references";

export class FileInfoCache {
    private readonly nodeReferences = new Map<ts.Node, ReadonlyArray<ts.ReferenceEntry> | undefined>();
    private readonly nodeReferencesAsNodes = new Map<ts.Node, ReadonlyArray<ts.Node> | undefined>();
    private variableUsage: ReadonlyMap<ts.Identifier, tsutils.VariableInfo> | undefined;

    public constructor(
        private readonly filteredNodes: ReadonlySet<ts.Node>,
        private readonly services: LanguageServices,
        private readonly sourceFile: ts.SourceFile,
    ) {}

    /**
     * @returns All raw reference entries from a node.
     */
    public getNodeReferences(node: ts.Node): ReadonlyArray<ts.ReferenceEntry> | undefined {
        let references = this.nodeReferences.get(node);

        if (references === undefined) {
            references = findRelevantNodeReferences(this.filteredNodes, this.services, this.sourceFile, node);
        }

        return references;
    }

    /**
     * @returns All corresponding nodes for the reference entries for a node.
     */
    public getNodeReferencesAsNodes(node: ts.Node): ReadonlyArray<ts.Node> | undefined {
        let references = this.nodeReferencesAsNodes.get(node);

        if (references === undefined) {
            references = findRelevantNodeReferencesAsNodes(this.filteredNodes, this.services, this.sourceFile, node);
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
