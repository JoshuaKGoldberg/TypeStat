import { describe, expect, it } from "vitest";

import { collectFileNames } from "./collectFileNames.js";

describe("collectFileNames", () => {
	it("should collect files with wildcard when collection succeeds", async () => {
		const cwd = process.cwd();
		const res = await collectFileNames(cwd, ["src/*"]);
		expect(res?.fileNames).toContain(`${cwd}/src/collectFileNames.test.ts`);
	});

	it("should return undefined if includes is empty array", async () => {
		const cwd = process.cwd();
		const res = await collectFileNames(cwd, []);
		expect(res).toBeUndefined();
	});

	it("should return error if node_modules are implicitly included", async () => {
		const cwd = process.cwd();
		const res = await collectFileNames(cwd, ["*"]);
		expect(res?.error).toEqual(
			`At least one path including node_modules was included implicitly: '${cwd}/node_modules'. Either adjust TypeStat's included files to not include node_modules (recommended) or explicitly include node_modules/ (not recommended).`,
		);
	});

	it("should NOT return error if node_modules are explicitly included", async () => {
		const cwd = process.cwd();
		const res = await collectFileNames(cwd, ["node_modules"]);
		expect(res?.fileNames.length).toBeGreaterThan(0);
	});
});
