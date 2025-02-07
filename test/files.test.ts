import { describe, expect, it } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

describe("files", () => {
	it("addition above", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "files/above");
	}, 7000);

	it("addition below", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "files/below");
	}, 7000);

	it("both", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "files/both");
	}, 7000);

	it("empty addition", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "files/empty");
	}, 7000);
});
