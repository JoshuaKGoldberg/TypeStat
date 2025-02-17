import { describe, expect, it } from "vitest";

import { checkTestResult } from "../src/tests/testSetup.js";

const cwd = import.meta.dirname;

describe("noImplicitAny", () => {
	it("parameters", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/noImplicitAny/parameters");
	}, 7000);

	it("property declarations", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/noImplicitAny/propertyDeclarations");
	});

	it("variable declarations", async () => {
		expect.assertions(3);
		await checkTestResult(cwd, "fixes/noImplicitAny/variableDeclarations");
	});
});
