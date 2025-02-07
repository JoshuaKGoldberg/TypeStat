import { describe, expect, it } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

describe("noImplicitThis", () => {
	it("noImplicitThis", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/noImplicitThis");
	});
});
