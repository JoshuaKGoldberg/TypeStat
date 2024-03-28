import { describe, expect, it } from "vitest";
import { runMutationForTest } from "../../../../../../src/tests/testSetup.js";

describe("incompleteTypes - reactTypes - notReactProps", () => {
	it("matches snapshot", async () => {
		const resultFile = await runMutationForTest(
			import.meta.dirname,
			"original.tsx",
		);
		expect(resultFile).toMatchFileSnapshot("./expected.tsx");
	});
});
