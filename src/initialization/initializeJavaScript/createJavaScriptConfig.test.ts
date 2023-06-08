import { InitializationImports } from "./imports";
import { InitializationRenames } from "./renames";
import { createJavaScriptConfig } from "./createJavaScriptConfig";
import { InitializationSuppressions } from "./suppressions";

describe(createJavaScriptConfig, () => {
    test.each([
        {
            expected: {
                files: { renameExtensions: "ts" },
                fixes: { incompleteTypes: true, missingProperties: true, noImplicitAny: true },
                project: "tsconfig.json",
            },
            name: "Basic",
            settings: {
                imports: InitializationImports.No,
                project: {
                    filePath: "tsconfig.json",
                },
                renames: InitializationRenames.TS,
                suppressions: InitializationSuppressions.No,
            },
        },
        {
            expected: {
                files: { renameExtensions: "ts" },
                fixes: { incompleteTypes: true, missingProperties: true, noImplicitAny: true },
                suppressions: { typeErrors: true },
                project: "tsconfig.json",
            },
            name: "Basic with Suppressions",
            settings: {
                imports: InitializationImports.No,
                project: {
                    filePath: "tsconfig.json",
                },
                renames: InitializationRenames.TS,
                suppressions: InitializationSuppressions.Yes,
            },
        },
        {
            expected: [
                {
                    files: { renameExtensions: "ts" },
                    fixes: { importExtensions: true },
                    include: ["src/**/*.{js,jsx}"],
                    project: "tsconfig.json",
                },
                {
                    fixes: { incompleteTypes: true, missingProperties: true, noImplicitAny: true },
                    include: ["src/**/*.ts"],
                    project: "tsconfig.json",
                },
            ],
            name: "TS Renames (multiple sourceFiles extensions)",
            settings: {
                imports: InitializationImports.Yes,
                project: {
                    filePath: "tsconfig.json",
                },
                renames: InitializationRenames.TS,
                sourceFiles: "src/**/*.{js,jsx}",
                suppressions: InitializationSuppressions.No,
            },
        },
        {
            expected: [
                {
                    files: { renameExtensions: "tsx" },
                    fixes: { importExtensions: true },
                    include: ["src/**/*.{js,jsx}"],
                    project: "tsconfig.json",
                },
                {
                    fixes: { incompleteTypes: true, missingProperties: true, noImplicitAny: true },
                    include: ["src/**/*.tsx"],
                    project: "tsconfig.json",
                },
            ],
            name: "TSX Renames (multiple sourceFiles extensions)",
            settings: {
                imports: InitializationImports.Yes,
                project: {
                    filePath: "tsconfig.json",
                },
                renames: InitializationRenames.TSX,
                sourceFiles: "src/**/*.{js,jsx}",
                suppressions: InitializationSuppressions.No,
            },
        },
        {
            expected: [
                { files: { renameExtensions: true }, fixes: { importExtensions: true }, project: "tsconfig.json" },
                { fixes: { incompleteTypes: true, missingProperties: true, noImplicitAny: true }, project: "tsconfig.json" },
            ],
            name: "Auto Renames (no sourceFiles)",
            settings: {
                imports: InitializationImports.Yes,
                project: {
                    filePath: "tsconfig.json",
                },
                renames: InitializationRenames.Auto,
                suppressions: InitializationSuppressions.No,
            },
        },
        {
            expected: [
                {
                    files: { renameExtensions: true },
                    fixes: { importExtensions: true },
                    include: ["src/**/*.js"],
                    project: "tsconfig.json",
                },
                {
                    fixes: { incompleteTypes: true, missingProperties: true, noImplicitAny: true },
                    include: ["src/**/*.{ts,tsx}"],
                    project: "tsconfig.json",
                },
            ],
            name: "Auto Renames (single sourceFiles extension)",
            settings: {
                imports: InitializationImports.Yes,
                project: {
                    filePath: "tsconfig.json",
                },
                renames: InitializationRenames.Auto,
                sourceFiles: "src/**/*.js",
                suppressions: InitializationSuppressions.No,
            },
        },
        {
            expected: [
                {
                    files: { renameExtensions: true },
                    fixes: { importExtensions: true },
                    include: ["src/**/*.{js,jsx}"],
                    project: "tsconfig.json",
                },
                {
                    fixes: { incompleteTypes: true, missingProperties: true, noImplicitAny: true },
                    include: ["src/**/*.{ts,tsx}"],
                    project: "tsconfig.json",
                },
            ],
            name: "Auto Renames (multiple sourceFiles extensions)",
            settings: {
                imports: InitializationImports.Yes,
                project: {
                    filePath: "tsconfig.json",
                },
                renames: InitializationRenames.Auto,
                sourceFiles: "src/**/*.{js,jsx}",
                suppressions: InitializationSuppressions.No,
            },
        },
        {
            expected: [
                {
                    files: { renameExtensions: true },
                    fixes: { importExtensions: true },
                    include: ["src/**/*.js(x)"],
                    project: "tsconfig.json",
                },
                {
                    fixes: { incompleteTypes: true, missingProperties: true, noImplicitAny: true },
                    include: ["src/**/*.ts(x)"],
                    project: "tsconfig.json",
                },
            ],
            name: "Auto Renames (parenthesized sourceFiles extensions)",
            settings: {
                imports: InitializationImports.Yes,
                project: {
                    filePath: "tsconfig.json",
                },
                renames: InitializationRenames.Auto,
                sourceFiles: "src/**/*.js(x)",
                suppressions: InitializationSuppressions.No,
            },
        },
    ])("$name", ({ expected, settings }) => {
        const actual = createJavaScriptConfig(settings);

        expect(actual).toEqual(expected);
    });
});
