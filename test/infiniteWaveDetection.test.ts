import path from "path";
import { expect, test } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

test("Infinite wave detection", async () => {
	const caseDir = path.join(
		import.meta.dirname,
		"cases/infinite wave detection",
	);
	const { actualContent, expectedFilePath, options } =
		await runMutationTest(caseDir);
	await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	expect(options).toMatchSnapshot("options");
}, 50000);
