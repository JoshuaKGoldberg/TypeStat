import path from "node:path";
import { describe, expect, it } from "vitest";

import { collectFileNames } from "./collectFileNames.js";

describe("collectFileNames", () => {
	it("should collect files with wildcard", async () => {
		const cwd = path.resolve(import.meta.dirname, "..");
		const fileNames = await collectFileNames(
			path.resolve(import.meta.dirname),
			["*"],
		);
		const names = Array.isArray(fileNames)
			? (fileNames as string[]).map((item) => item.replace(cwd, "<rootDir>"))
			: undefined;

		// Assert
		expect(names).toContain("<rootDir>/src/collectFileNames.test.ts");
	});

	it("return error if node modules are included", async () => {
		const cwd = path.resolve(import.meta.dirname, "..");
		const fileNames = await collectFileNames(cwd, ["*"]);

		// Assert
		const error =
			typeof fileNames === "string"
				? fileNames.replace(cwd, "<rootDir>")
				: undefined;
		expect(error).toEqual(
			"At least one path including node_modules was included implicitly: '<rootDir>/node_modules'. Either adjust TypeStat's included files to not include node_modules (recommended) or explicitly include node_modules/ (not recommended).",
		);
	});
});
