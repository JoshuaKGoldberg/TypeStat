import { describeMutationTestCases } from "automutate-tests";
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";

import { requireExposedTypeScript } from "../mutations/createExposedTypeScript";
import { fillOutRawOptions } from "../options/fillOutRawOptions";
import { RawTypeStatOptions, TypeStatOptions } from "../options/types";
import { createTypeStatProvider } from "../runtime/createTypeStatProvider";
import { arrayify } from "../shared/arrays";

const parsed = new Command()
    // Allow unknown options for the case of IDE debuggers who directly write to process.argv
    // If this line is removed, VS Code debugging will break 😲
    .allowUnknownOption(true)
    .option("-i, --include [include]", "path to a TypeScript project file")
    .option("-a, --accept", "override existing expected results instead of asserting")
    .parse(process.argv)
    .opts();

// Modify TypeScript here so that no tests incur the performance penalty of doing it themselves
const ts = requireExposedTypeScript();

const rawPathToRegExp = (rawPath: string) => new RegExp(`.*${rawPath.split(/\\|\//g).slice(-3).join(".*")}.*`, "i");

// The .vscode/launch.json task adds includes via environment variable
const includes = [...arrayify(parsed.include ?? []).map(rawPathToRegExp), ...arrayify(process.env.TEST_GLOB).map(rawPathToRegExp)];

describeMutationTestCases(
    path.join(__dirname, "../../test"),
    (fileName, typeStatPath) => {
        if (typeStatPath === undefined) {
            throw new Error(`Could not find typestat.json for ${fileName}.`);
        }

        const projectDirectory = path.dirname(typeStatPath);
        const rawOptions = JSON.parse(fs.readFileSync(typeStatPath).toString()) as RawTypeStatOptions;

        const projectPath = path.join(projectDirectory, "tsconfig.json");
        const rawCompilerOptions = fs.readFileSync(typeStatPath).toString();
        const compilerOptions = ts.parseConfigFileTextToJson(typeStatPath, rawCompilerOptions).config;
        const output = {
            log: () => {},
            stderr: console.error.bind(console),
            stdout: () => {},
        };

        return createTypeStatProvider({
            ...(fillOutRawOptions({
                argv: { args: [] },
                compilerOptions,
                cwd: path.dirname(projectPath),
                output,
                projectPath,
                rawOptions: {
                    ...rawOptions,
                    projectPath,
                },
            }) as TypeStatOptions),
            fileNames: [fileName],
        });
    },
    {
        accept: parsed.accept || !!process.env.TEST_ACCEPT,
        actual: (original) => (original.endsWith("x") ? "actual.tsx" : "actual.ts"),
        expected: (original) => (original.endsWith("x") ? "expected.tsx" : "expected.ts"),
        includes,
        normalizeEndlines: "\n",
        original: "./original.*",
        settings: "typestat.json",
    },
);
