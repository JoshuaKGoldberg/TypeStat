import path from "node:path";
import { expect, test } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

test("import extensions", async () => {
	const caseDir = path.join(
		import.meta.dirname,
		"cases/fixes/importExtensions",
	);
	const { actualContent, expectedFilePath, options } =
		await runMutationTest(caseDir);
	await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	expect(options).toMatchSnapshot("options");
}, 10000);
