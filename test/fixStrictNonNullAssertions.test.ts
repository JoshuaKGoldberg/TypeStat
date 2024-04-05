import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

describe("strictNonNullAssertions", () => {
	it("binaryExpressions", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/strictNonNullAssertions/binaryExpressions",
		);
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});

	it("callExpressions", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/strictNonNullAssertions/callExpressions",
		);
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});

	it("objectLiterals", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/strictNonNullAssertions/objectLiterals",
		);
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});

	it("propertyAccesses", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/strictNonNullAssertions/propertyAccesses",
		);
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});

	it("returnTypes", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/strictNonNullAssertions/returnTypes",
		);
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});
});
