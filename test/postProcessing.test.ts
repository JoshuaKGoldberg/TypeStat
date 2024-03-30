import path from "path";
import { expect, test } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

test("Post processsing", async () => {
	const caseDir = path.join(import.meta.dirname, "cases/post processing");
	const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
	await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
});
