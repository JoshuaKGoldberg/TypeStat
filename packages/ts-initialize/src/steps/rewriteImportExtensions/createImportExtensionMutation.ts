import { TextInsertMutation } from "automutate";
import { glob } from "glob";
import * as path from "path";

import { ExtensionlessExportOrImport } from "./isExtensionlessExportOrImport.js";

export const createImportExtensionMutation = (
	dirPath: string,
	node: ExtensionlessExportOrImport,
): TextInsertMutation | undefined => {
	// Try each path that the import could resolve to
	const basePath = path.join(dirPath, node.moduleSpecifier.text);
	const possibilities = glob.sync(basePath + ".*");

	for (const possibility of possibilities) {
		// A source file or built output indicates the import is likely fine
		// eslint-disable-next-line regexp/no-unused-capturing-group
		if (/(jsx?)|(tsx?)|(map)$/.test(possibility)) {
			return undefined;
		}

		// Add the file's full extension to the original module specifier
		return {
			insertion: "." + path.basename(possibility).split(".").slice(1).join("."),
			range: {
				begin: node.moduleSpecifier.end - 1,
			},
			type: "text-insert",
		};
	}

	return undefined;
};
