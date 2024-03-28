import { describe, expect, it } from "vitest";
import { runMutationForTest } from "../../../../../../src/tests/testSetup.js";

describe("incompleteTypes - implicitGenerics - incompleteImplicitClassGenerics", () => {
	it("matches snapshot", async () => {
		const resultFile = await runMutationForTest(import.meta.dirname);
		expect(resultFile).toMatchFileSnapshot("./expected.ts");
	});
}, 50000);
