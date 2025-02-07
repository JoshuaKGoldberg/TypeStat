import { describe, expect, it } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

describe("No inferable types", () => {
	it("parameters", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/noInferableTypes/parameters");
	});

	it("property declarations", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/noInferableTypes/propertyDeclarations");
	});

	it("variable declarations", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/noInferableTypes/variableDeclarations");
	});
});
