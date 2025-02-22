import { expect, test } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

test("enum as argument", async () => {
	expect.assertions(3);
	await checkTestResult(cwd, "fixes/incompleteTypes/enumAsArgument");
}, 10000);
