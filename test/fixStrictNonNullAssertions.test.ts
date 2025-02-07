import { describe, expect, it } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

describe("strictNonNullAssertions", () => {
	it("binaryExpressions", async () => {
		expect.assertions(3);
		await checkTestResult(
			cwd,
			"fixes/strictNonNullAssertions/binaryExpressions",
		);
	}, 10000);

	it("callExpressions", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/strictNonNullAssertions/callExpressions");
	}, 10000);

	it("objectLiterals", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/strictNonNullAssertions/objectLiterals");
	});

	it("propertyAccesses", async () => {
		expect.assertions(3);
		await checkTestResult(
			cwd,
			"fixes/strictNonNullAssertions/propertyAccesses",
		);
	}, 10000);

	it("returnTypes", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/strictNonNullAssertions/returnTypes");
	});
});
