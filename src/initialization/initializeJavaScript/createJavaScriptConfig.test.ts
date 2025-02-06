import { describe, expect, it } from "vitest";

import { RawTypeStatOptions } from "../../options/types.js";
import { InitializationCleanups } from "./cleanups.js";
import {
	createJavaScriptConfig,
	JavaScriptConfigSettings,
} from "./createJavaScriptConfig.js";
import { InitializationImports } from "./imports.js";
import { InitializationRenames } from "./renames.js";

interface TestArguments {
	expected: RawTypeStatOptions | RawTypeStatOptions[];
	name: string;
	settings: JavaScriptConfigSettings;
}

describe("createJavaScriptConfig", () => {
	it.each<TestArguments>([
		{
			expected: {
				files: { renameExtensions: "ts" },
				fixes: {
					incompleteTypes: true,
					missingProperties: true,
					noImplicitAny: true,
				},
				projectPath: "tsconfig.json",
			},
			name: "Basic",
			settings: {
				cleanups: InitializationCleanups.No,
				imports: InitializationImports.No,
				project: {
					filePath: "tsconfig.json",
				},
				renames: InitializationRenames.TS,
			},
		},
		{
			expected: {
				cleanups: { suppressTypeErrors: true },
				files: { renameExtensions: "ts" },
				fixes: {
					incompleteTypes: true,
					missingProperties: true,
					noImplicitAny: true,
				},
				projectPath: "tsconfig.json",
			},
			name: "Basic with Suppressions",
			settings: {
				cleanups: InitializationCleanups.Yes,
				imports: InitializationImports.No,
				project: {
					filePath: "tsconfig.json",
				},
				renames: InitializationRenames.TS,
			},
		},
		{
			expected: [
				{
					files: { renameExtensions: "ts" },
					fixes: { importExtensions: true },
					include: ["src/**/*.{js,jsx}"],
					projectPath: "tsconfig.json",
				},
				{
					fixes: {
						incompleteTypes: true,
						missingProperties: true,
						noImplicitAny: true,
					},
					include: ["src/**/*.ts"],
					projectPath: "tsconfig.json",
				},
			],
			name: "TS Renames (multiple sourceFiles extensions)",
			settings: {
				cleanups: InitializationCleanups.No,
				imports: InitializationImports.Yes,
				project: {
					filePath: "tsconfig.json",
				},
				renames: InitializationRenames.TS,
				sourceFiles: "src/**/*.{js,jsx}",
			},
		},
		{
			expected: [
				{
					files: { renameExtensions: "tsx" },
					fixes: { importExtensions: true },
					include: ["src/**/*.{js,jsx}"],
					projectPath: "tsconfig.json",
				},
				{
					fixes: {
						incompleteTypes: true,
						missingProperties: true,
						noImplicitAny: true,
					},
					include: ["src/**/*.tsx"],
					projectPath: "tsconfig.json",
				},
			],
			name: "TSX Renames (multiple sourceFiles extensions)",
			settings: {
				cleanups: InitializationCleanups.No,
				imports: InitializationImports.Yes,
				project: {
					filePath: "tsconfig.json",
				},
				renames: InitializationRenames.TSX,
				sourceFiles: "src/**/*.{js,jsx}",
			},
		},
		{
			expected: [
				{
					files: { renameExtensions: true },
					fixes: { importExtensions: true },
					projectPath: "tsconfig.json",
				},
				{
					fixes: {
						incompleteTypes: true,
						missingProperties: true,
						noImplicitAny: true,
					},
					projectPath: "tsconfig.json",
				},
			],
			name: "Auto Renames (no sourceFiles)",
			settings: {
				cleanups: InitializationCleanups.No,
				imports: InitializationImports.Yes,
				project: {
					filePath: "tsconfig.json",
				},
				renames: InitializationRenames.Auto,
			},
		},
		{
			expected: [
				{
					files: { renameExtensions: true },
					fixes: { importExtensions: true },
					include: ["src/**/*.js"],
					projectPath: "tsconfig.json",
				},
				{
					fixes: {
						incompleteTypes: true,
						missingProperties: true,
						noImplicitAny: true,
					},
					include: ["src/**/*.{ts,tsx}"],
					projectPath: "tsconfig.json",
				},
			],
			name: "Auto Renames (single sourceFiles extension)",
			settings: {
				cleanups: InitializationCleanups.No,
				imports: InitializationImports.Yes,
				project: {
					filePath: "tsconfig.json",
				},
				renames: InitializationRenames.Auto,
				sourceFiles: "src/**/*.js",
			},
		},
		{
			expected: [
				{
					files: { renameExtensions: true },
					fixes: { importExtensions: true },
					include: ["src/**/*.{js,jsx}"],
					projectPath: "tsconfig.json",
				},
				{
					fixes: {
						incompleteTypes: true,
						missingProperties: true,
						noImplicitAny: true,
					},
					include: ["src/**/*.{ts,tsx}"],
					projectPath: "tsconfig.json",
				},
			],
			name: "Auto Renames (multiple sourceFiles extensions)",
			settings: {
				cleanups: InitializationCleanups.No,
				imports: InitializationImports.Yes,
				project: {
					filePath: "tsconfig.json",
				},
				renames: InitializationRenames.Auto,
				sourceFiles: "src/**/*.{js,jsx}",
			},
		},
		{
			expected: [
				{
					files: { renameExtensions: true },
					fixes: { importExtensions: true },
					include: ["src/**/*.js(x)"],
					projectPath: "tsconfig.json",
				},
				{
					fixes: {
						incompleteTypes: true,
						missingProperties: true,
						noImplicitAny: true,
					},
					include: ["src/**/*.ts(x)"],
					projectPath: "tsconfig.json",
				},
			],
			name: "Auto Renames (parenthesized sourceFiles extensions)",
			settings: {
				cleanups: InitializationCleanups.No,
				imports: InitializationImports.Yes,
				project: {
					filePath: "tsconfig.json",
				},
				renames: InitializationRenames.Auto,
				sourceFiles: "src/**/*.js(x)",
			},
		},
	])("$name", ({ expected, settings }) => {
		const actual = createJavaScriptConfig(settings);

		expect(actual).toEqual(expected);
	});
});
