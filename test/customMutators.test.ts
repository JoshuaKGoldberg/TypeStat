import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

describe("Custom mutators", () => {
	it("empty array", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/custom mutators/empty",
		);
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});

	it("one mutator", async () => {
		const caseDir = path.join(import.meta.dirname, "cases/custom mutators/one");
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});

	it("two mutators", async () => {
		const caseDir = path.join(import.meta.dirname, "cases/custom mutators/two");
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});
});
