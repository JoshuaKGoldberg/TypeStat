import { describeMutationTestCases } from "automutate-tests";
import * as fs from "fs";
import * as path from "path";

import { fillOutRawOptions } from "../options/parsing";
import { RawTypeUpOptions } from "../options/types";
import { createTypeUpMutationsProvider } from "../runtime/createTypeUpMutationsProvider";

describeMutationTestCases(
    path.join(__dirname, "../../test"),
    (fileName: string, projectPath: string | undefined) => {
        if (projectPath === undefined) {
            throw new Error(`Could not find typeup.json for ${fileName}.`);
        }

        const rawOptions = JSON.parse(fs.readFileSync(projectPath).toString()) as RawTypeUpOptions;
        const options = fillOutRawOptions({
            ...rawOptions,
            projectPath: path.join(path.dirname(projectPath), "tsconfig.json"),
        });

        return createTypeUpMutationsProvider(options);
    },
    {
        actual: "actual.ts",
        expected: "expected.ts",
        original: "original.ts",
        settings: "typeup.json",
    },
);
