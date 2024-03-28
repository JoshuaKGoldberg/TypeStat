import { describe, expect, it } from "vitest";
import { runMutationForTest } from "../../../../src/tests/testSetup.js";

describe("files - below", () => {
	it("matches snapshot", async () => {
		const resultFile = await runMutationForTest(import.meta.dirname);
		expect(resultFile).toMatchFileSnapshot("./expected.ts");
	});
}, 50000);
