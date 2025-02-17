import { describe, expect, it } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

describe("Cleanups", () => {
	it("suppressTypeErrors", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "cleanups/suppressTypeErrors");
	});

	it("non-TypeErrors", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "cleanups/nonTypeErrors");
	}, 6000);
});
