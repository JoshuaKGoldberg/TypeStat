import { describe, expect, it } from "vitest";

import { getFixImportExtensionsMutations } from "./index.js";

describe("getFixImportExtensionsMutations", () => {
	it("should create mutation for adding extension", () => {
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

	it("should not create mutation for .ts file", () => {
		const mutations = getFixImportExtensionsMutations(
			process.cwd() + "/src/mutators/builtIn/index.ts",
			"./fixImportExtensions",
			1,
		);
		expect(mutations).toMatchInlineSnapshot(`undefined`);
	});
});
