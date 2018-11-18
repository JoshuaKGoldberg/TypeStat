import { describeMutationTestCases } from "automutate-tests";
import * as fs from "fs";
import * as path from "path";

import { createTypeUpMutationsProvider } from "./mutations/createTypeUpMutationsProvider";
import { convertRawTypeUpOptions, RawTypeUpOptions } from "./options";

describeMutationTestCases(
    path.join(__dirname, "../test"),
    (fileName: string, projectPath: string | undefined) => {
        if (projectPath === undefined) {
            throw new Error(`Could not find typeup.json for ${fileName}.`);
        }

        const rawOptions = JSON.parse(fs.readFileSync(projectPath).toString()) as RawTypeUpOptions;
        const options = convertRawTypeUpOptions(
            {
                ...rawOptions,
                projectPath: path.join(path.dirname(projectPath), "tsconfig.json"),
            },
            [fileName],
        );

        return createTypeUpMutationsProvider(options);
    },
    {
        actual: "actual.ts",
        expected: "expected.ts",
        original: "original.ts",
        settings: "typeup.json",
    },
);
