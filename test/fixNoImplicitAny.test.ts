import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

describe("noImplicitAny", () => {
	it("parameters", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/noImplicitAny/parameters",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	}, 6000);

	it("property declarations", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/noImplicitAny/propertyDeclarations",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});

	it("variable declarations", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/noImplicitAny/variableDeclarations",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});
});
