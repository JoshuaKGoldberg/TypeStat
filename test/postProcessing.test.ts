import { expect, test } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

test("Post processing", async () => {
	expect.assertions(3);
	await checkTestResult(cwd, "post processing");
}, 50000);
