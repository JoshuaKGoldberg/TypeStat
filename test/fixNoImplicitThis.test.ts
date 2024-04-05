import path from "node:path";
import { describe, expect, it } from "vitest";

import { runMutationTest } from "../src/tests/testSetup.js";

describe("noImplicitThis", () => {
	it("noImplicitThis", async () => {
		const caseDir = path.join(
			import.meta.dirname,
			"cases/fixes/noImplicitThis",
		);
		const { actualContent, expectedFilePath, options } =
			await runMutationTest(caseDir);
		await expect(actualContent).toMatchFileSnapshot(expectedFilePath);
		expect(options).toMatchSnapshot("options");
	});
});
