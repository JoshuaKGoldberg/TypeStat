import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

describe("No inferable types", () => {
	it("parameters", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/noInferableTypes/parameters",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});

	it("property declarations", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/noInferableTypes/propertyDeclarations",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});

	it("variable declarations", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/noInferableTypes/variableDeclarations",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});
});
