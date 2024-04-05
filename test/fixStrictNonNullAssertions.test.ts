import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

describe("strictNonNullAssertions", () => {
	it("binaryExpressions", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/strictNonNullAssertions/binaryExpressions",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	}, 6000);

	it("callExpressions", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/strictNonNullAssertions/callExpressions",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});

	it("objectLiterals", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/strictNonNullAssertions/objectLiterals",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});

	it("propertyAccesses", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/strictNonNullAssertions/propertyAccesses",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});

	it("returnTypes", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/strictNonNullAssertions/returnTypes",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	}, 6000);
});
