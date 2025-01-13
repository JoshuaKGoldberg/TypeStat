import { describe, expect, it } from "vitest";

import { InitializationImprovement } from "./improvements.js";
import { generateMultiTypeScriptConfig } from "./writeMultiTypeScriptConfig.js";

describe("writeMultiTypeScriptConfig", () => {
	it("creates multi TypeScript config", () => {
		const config = generateMultiTypeScriptConfig({
			fileName: "typestat.json",
			improvements: new Set([
				InitializationImprovement.MissingProperties,
				InitializationImprovement.NoImplicitAny,
				InitializationImprovement.NoImplicitThis,
				InitializationImprovement.NoInferableTypes,
				InitializationImprovement.StrictNullChecks,
			]),
			project: { filePath: "./tsconfig.json" },
			testFiles: "test/**/*.{ts,tsx}",
		});

		expect(config).toStrictEqual([
			{
				fixes: {
					incompleteTypes: true,
					noImplicitAny: true,
					noImplicitThis: true,
					noInferableTypes: true,
					strictNonNullAssertions: true,
				},
				include: ["test/**/*.{ts,tsx}"],
				projectPath: "./tsconfig.json",
				types: {
					strictNullChecks: true,
				},
			},
			{
				fixes: {
					incompleteTypes: true,
					noImplicitAny: true,
					noImplicitThis: true,
					noInferableTypes: true,
				},
				include: undefined,
				projectPath: "./tsconfig.json",
			},
			{
				fixes: {
					incompleteTypes: true,
					noImplicitAny: true,
					noImplicitThis: true,
					noInferableTypes: true,
				},
				include: ["test/**/*.{ts,tsx}"],
				projectPath: "./tsconfig.json",
			},
		]);
	});
});
