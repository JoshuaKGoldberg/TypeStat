import * as tsutils from "tsutils";
import * as ts from "typescript";
import { LanguageServices } from "../services/language";
import { findRelevantNodeReferences } from "./references";

export class FileInfoCache {
    private readonly nodeReferences = new Map<ts.Node, ReadonlyArray<ts.ReferenceEntry> | undefined>();
    private variableUsage: ReadonlyMap<ts.Identifier, tsutils.VariableInfo> | undefined;

    public constructor(
        private readonly filteredNodes: ReadonlySet<ts.Node>,
        private readonly services: LanguageServices,
        private readonly sourceFile: ts.SourceFile,
    ) {}

    public getNodeReferences(node: ts.Node): ReadonlyArray<ts.ReferenceEntry> | undefined {
        let references = this.nodeReferences.get(node);

        if (references === undefined) {
            references = findRelevantNodeReferences(this.filteredNodes, this.services, this.sourceFile, node);
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
