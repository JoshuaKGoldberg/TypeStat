import { describeMutationTestCases } from "automutate-tests";
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

import { fillOutRawOptions } from "../options/fillOutRawOptions";
import { RawTypeStatOptions, TypeStatOptions } from "../options/types";
import { createTypeStatProvider } from "../runtime/createTypeStatProvider";
import { arrayify } from "../shared/arrays";

import { FakeWritableStream } from "./FakeWritableStream";

interface ParsedTestArgv {
    accept?: boolean;
    include?: string;
}

const parsed = new Command()
    // Allow unknown options for the case of IDE debuggers who directly write to process.argv
    // If this line is removed, VS Code debugging will break 😲
    .allowUnknownOption(true)
    .option("-i, --include [include]", "path to a TypeScript project file")
    .option("-a, --accept", "override existing expected results instead of asserting")
    .parse(process.argv) as ParsedTestArgv;

describeMutationTestCases(
    path.join(__dirname, "../../test"),
    (fileName: string, typeStatPath: string | undefined) => {
        if (typeStatPath === undefined) {
            throw new Error(`Could not find typestat.json for ${fileName}.`);
        }

        const projectDirectory = path.dirname(typeStatPath);
        const rawOptions = JSON.parse(fs.readFileSync(typeStatPath).toString()) as RawTypeStatOptions;

        const projectPath = path.join(projectDirectory, "tsconfig.json");
        const rawCompilerOptions = fs.readFileSync(typeStatPath).toString();
        const compilerOptions = ts.parseConfigFileTextToJson(typeStatPath, rawCompilerOptions).config as {};
        const logger = {
            stderr: process.stderr,
            stdout: new FakeWritableStream(),
        };

        return createTypeStatProvider({
            ...(fillOutRawOptions({
                argv: { logger },
                compilerOptions,
                cwd: path.dirname(projectPath),
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
        accept: parsed.accept,
        actual: (original) => (original.endsWith("x") ? "actual.tsx" : "actual.ts"),
        expected: (original) => (original.endsWith("x") ? "expected.tsx" : "expected.ts"),
        includes: arrayify(parsed.include).map((include) => new RegExp(`(.*)${include}(.*)`)),
        normalizeEndlines: "\n",
        original: "../original.*",
        settings: "typestat.json",
    },
);
