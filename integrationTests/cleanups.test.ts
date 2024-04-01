import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "./testSetup.js";

describe("Cleanups", () => {
	it("suppressTypeErrors", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/cleanups/suppressTypeErrors",
		);
		const { actualContent, expectedFilePath } = await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
	});
});
