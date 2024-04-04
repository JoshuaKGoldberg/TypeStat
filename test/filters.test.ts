import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

describe("filters", () => {
	it("empty", async () => {
		const caseDir = path.join(import.meta.dirname, "./cases/filters/empty");
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});

	it("one", async () => {
		const caseDir = path.join(import.meta.dirname, "./cases/filters/one");
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});

	it("two", async () => {
		const caseDir = path.join(import.meta.dirname, "./cases/filters/two");
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});
});
