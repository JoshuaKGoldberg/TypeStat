import path from "path";
import { expect, test } from "vitest";

import { runMutationTest } from "./testSetup.js";

test("Post processing", async () => {
	const caseDir = path.join(import.meta.dirname, "cases/post processing");
	const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
	await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
}, 50000);
