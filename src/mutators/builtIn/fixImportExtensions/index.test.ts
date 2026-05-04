import { describe, expect, it } from "vitest";

import { getFixImportExtensionsMutations } from "./index.js";

describe("getFixImportExtensionsMutations", () => {
	it("should collect list of tsconfig files", () => {
		const mutations = getFixImportExtensionsMutations(
			process.cwd() + "/src/mutators/builtIn/fixImportExtensions/index.ts",
			"./README",
			1,
		);
		expect(mutations).toMatchInlineSnapshot(`
			{
			  "insertion": ".md",
			  "range": {
			    "begin": 0,
			  },
			  "type": "text-insert",
			}
		`);
	});
});
