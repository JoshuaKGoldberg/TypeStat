import { tsquery } from "@phenomnomnominal/tsquery";
import ts from "typescript";

import { TypeStatOptions } from "../options/types.js";

export const collectFilteredNodes = (
	options: TypeStatOptions,
	sourceFile: ts.SourceFile,
) => {
	const filteredNodes = new Set<ts.Node>();

	if (options.filters === undefined) {
		return filteredNodes;
	}

	for (const filter of options.filters) {
		for (const node of tsquery(sourceFile, filter)) {
			filteredNodes.add(node);
		}
	}

	return filteredNodes;
};
