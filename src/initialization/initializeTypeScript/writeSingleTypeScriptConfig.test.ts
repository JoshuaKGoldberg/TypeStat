import { describe, expect, it } from "vitest";

import { InitializationImprovement } from "./improvements.js";
import { generateSingleTypeScriptConfig } from "./writeSingleTypeScriptConfig.js";

describe("writeMultiTypeScriptConfig", () => {
	it("creates multi TypeScript config", () => {
		const config = generateSingleTypeScriptConfig({
			fileName: "typestat.json",
			improvements: new Set([InitializationImprovement.NoImplicitAny]),
			project: { filePath: "./tsconfig.json" },
		});

		expect(config).toStrictEqual({
			fixes: {
				incompleteTypes: true,
				noImplicitAny: true,
			},
			projectPath: "./tsconfig.json",
		});
	});
});
