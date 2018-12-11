import { describeMutationTestCases } from "automutate-tests";
import * as fs from "fs";
import * as path from "path";
import { Writable } from "stream";

import { fillOutRawOptions } from "../options/fillOutRawOptions";
import { RawTypeStatOptions } from "../options/types";
import { createTypeStatMutationsProvider } from "../runtime/createTypeStatMutationsProvider";

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
                stderr: new Writable(),
                stdout: new Writable(),
            },
        });
    },
    {
        accept: process.argv.indexOf("--accept") !== -1,
        actual: "actual.ts",
        expected: "expected.ts",
        original: "../original.?s",
        settings: "typestat.json",
    },
);
