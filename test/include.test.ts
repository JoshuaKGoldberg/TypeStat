import { describe, expect, it } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

describe("include", () => {
	it("asterisk", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "include/asterisk");
	});

	it("directory", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "include/directory");
	});

	it("sub-directory", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "include/sub-directory");
	});
});
