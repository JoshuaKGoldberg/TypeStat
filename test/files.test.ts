import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

describe("files", () => {
	it("addition above", async () => {
		const caseDir = path.join(import.meta.dirname, "cases/files/above");
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	}, 7000);

	it("addition below", async () => {
		const caseDir = path.join(import.meta.dirname, "cases/files/below");
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	}, 7000);

	it("both", async () => {
		const caseDir = path.join(import.meta.dirname, "cases/files/both");
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	}, 7000);

	it("empty addition", async () => {
		const caseDir = path.join(import.meta.dirname, "cases/files/empty");
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	}, 7000);
});
