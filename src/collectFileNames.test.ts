import path from "node:path";
import { describe, expect, it } from "vitest";

import { collectFileNames } from "./collectFileNames.js";

describe("collectFileNames", () => {
	it("should collect files with wildcard when collection succeeds", async () => {
		const cwd = path.resolve(import.meta.dirname, "..");
		const fileNames = await collectFileNames(
			path.resolve(import.meta.dirname),
			["*"],
		);
		expect(fileNames).toContain(`${cwd}/src/collectFileNames.test.ts`);
	});

	it("should return error if node_modules are implicitly included", async () => {
		const cwd = path.resolve(import.meta.dirname, "..");
		const fileNames = await collectFileNames(cwd, ["*"]);
		expect(fileNames).toEqual(
			`At least one path including node_modules was included implicitly: '${cwd}/node_modules'. Either adjust TypeStat's included files to not include node_modules (recommended) or explicitly include node_modules/ (not recommended).`,
		);
	});
});
