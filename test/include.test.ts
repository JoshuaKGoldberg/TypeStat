import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

describe("include", () => {
	it("asterisk", async () => {
		const caseDir = path.join(import.meta.dirname, "cases/include/asterisk");
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});

	it("directory", async () => {
		const caseDir = path.join(import.meta.dirname, "cases/include/directory");
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});

	it("sub-directory", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/include/sub-directory",
		);
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});
});
