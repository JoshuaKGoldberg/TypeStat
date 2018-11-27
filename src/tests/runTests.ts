import { describeMutationTestCases } from "automutate-tests";
import * as fs from "fs";
import * as path from "path";

import { fillOutRawOptions } from "../options/parsing";
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
                write: () => {},
            },
        };

        return createTypeStatMutationsProvider(options);
    },
    {
        actual: "actual.ts",
        expected: "expected.ts",
        original: "original.ts",
        settings: "typestat.json",
    },
);
