import { describe, expect, it } from "vitest";

import { getTsConfigPaths } from "./index.js";

describe("getTsConfigPaths", () => {
	it("should collect list of tsconfig files", async () => {
		const cwd = process.cwd();
		const fileNames = await getTsConfigPaths();
		expect(fileNames).toHaveLength(2);
		expect(fileNames).toContain(`${cwd}/tsconfig.eslint.json`);
		expect(fileNames).toContain(`${cwd}/tsconfig.json`);
	});
});
