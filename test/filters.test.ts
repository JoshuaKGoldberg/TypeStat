import { describe, expect, it } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

describe("filters", () => {
	it("empty", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "filters/empty");
	}, 7000);

	it("one", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "filters/one");
	});

	it("two", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "filters/two");
	});
});
