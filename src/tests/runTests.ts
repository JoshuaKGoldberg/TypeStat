import { describeMutationTestCases } from "automutate-tests";
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";

import { fillOutRawOptions } from "../options/fillOutRawOptions";
import { RawTypeStatOptions } from "../options/types";
import { createTypeStatMutationsProvider } from "../runtime/createTypeStatMutationsProvider";
import { arrayify } from "../shared/arrayify";
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
    (fileName: string, projectPath: string | undefined) => {
        if (projectPath === undefined) {
            throw new Error(`Could not find typestat.json for ${fileName}.`);
        }

        const rawOptions = JSON.parse(fs.readFileSync(projectPath).toString()) as RawTypeStatOptions;

        return createTypeStatMutationsProvider({
            ...fillOutRawOptions(
                {},
                {
                    ...rawOptions,
                    projectPath: path.join(path.dirname(projectPath), "tsconfig.json"),
                }),
            logger: {
                stderr: new FakeWritableStream(),
                stdout: new FakeWritableStream(),
            },
        });
    },
    {
        accept: parsed.accept,
        actual: "actual.ts",
        expected: "expected.ts",
        includes: arrayify(parsed.include)
            .map((include) => new RegExp(`(.*)${include}(.*)`)),
        original: "../original.?s",
        settings: "typestat.json",
    },
);
