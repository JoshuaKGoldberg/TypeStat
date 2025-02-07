import { describe, expect, it } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

describe("Missing properties", () => {
	it("missing property accesses", async () => {
		expect.assertions(3);
		await checkTestResult(
			cwd,
			"fixes/missingProperties/missingPropertyAccesses",
		);
	}, 10000);
});
