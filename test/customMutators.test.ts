import { describe, expect, it } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

describe("Custom mutators", () => {
	it("empty array", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "custom mutators/empty");
	});

	it("one mutator", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "custom mutators/one");
	});

	it("two mutators", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "custom mutators/two");
	});
});
