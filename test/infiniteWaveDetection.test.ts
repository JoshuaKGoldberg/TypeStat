import { expect, test } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

test("Infinite wave detection", async () => {
	expect.assertions(3);
	await checkTestResult(cwd, "infinite wave detection");
}, 50000);
