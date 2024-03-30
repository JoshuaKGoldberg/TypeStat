import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

describe("Missing properties", () => {
	it("missing property accesses", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"./cases/fixes/missingProperties/missingPropertyAccesses",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});
});
