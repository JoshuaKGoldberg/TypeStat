import { describeMutationTestCases } from "automutate-tests";
import * as fs from "fs";
import * as path from "path";

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
        const options = {
            ...fillOutRawOptions({
                ...rawOptions,
                projectPath: path.join(path.dirname(projectPath), "tsconfig.json"),
            }),
            logger: {
                stderr: () => {},
                stdout: () => {},
            },
        };

        return createTypeStatMutationsProvider(options);
    },
    {
        accept: process.argv.indexOf("--accept") !== -1,
        actual: "actual.ts",
        expected: "expected.ts",
        // includes: [
        //     /(.*)parameters(.*)/gi,
        // ],
        original: "../original.ts",
        settings: "typestat.json",
    },
);
