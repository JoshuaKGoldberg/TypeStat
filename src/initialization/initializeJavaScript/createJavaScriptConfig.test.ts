import { InitializationImports } from "./imports";
import { InitializationRenames } from "./renames";
import { createJavaScriptConfig } from "./createJavaScriptConfig";
import { InitializationCleanups } from "./cleanups";

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
                files: { renameExtensions: "ts" },
                fixes: { incompleteTypes: true, missingProperties: true, noImplicitAny: true },
                cleanups: { suppressTypeErrors: true },
                project: "tsconfig.json",
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
                cleanups: InitializationCleanups.No,
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
                cleanups: InitializationCleanups.No,
                project: {
                    filePath: "tsconfig.json",
                },
                renames: InitializationRenames.TSX,
                sourceFiles: "src/**/*.{js,jsx}",
            },
        },
        {
            expected: [
                { files: { renameExtensions: true }, fixes: { importExtensions: true }, project: "tsconfig.json" },
                { fixes: { incompleteTypes: true, missingProperties: true, noImplicitAny: true }, project: "tsconfig.json" },
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
                cleanups: InitializationCleanups.No,
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
                cleanups: InitializationCleanups.No,
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
                cleanups: InitializationCleanups.No,
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
