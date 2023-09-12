import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { LanguageServices } from "../services/language.js";
import { findRelevantNodeReferencesAsNodes } from "./references.js";

export class FileInfoCache {
	private readonly nodeReferences = new Map<
		ts.Node,
		readonly ts.Node[] | undefined
	>();
	private variableUsage:
		| ReadonlyMap<ts.Identifier, tsutils.VariableInfo>
		| undefined;

	public constructor(
		private readonly filteredNodes: ReadonlySet<ts.Node>,
		private readonly services: LanguageServices,
		private readonly sourceFile: ts.SourceFile,
	) {}

	/**
	 * @returns All corresponding nodes for the reference entries for a node.
	 */
	public getNodeReferencesAsNodes(
		node: ts.Node,
	): readonly ts.Node[] | undefined {
		let references = this.nodeReferences.get(node);

		if (references === undefined) {
			references = findRelevantNodeReferencesAsNodes(
				this.filteredNodes,
				this.services,
				node,
			);
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
