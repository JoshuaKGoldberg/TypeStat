import { expect, test } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

test("import extensions", async () => {
	expect.assertions(3);
	await checkTestResult(cwd, "fixes/importExtensions");
}, 10000);
