import * as ts from "typescript";

import { TypeStatArgv } from "../../index";
import { RawTypeStatOptions } from "../types";

export const collectNoImplicitAny = (
    argv: TypeStatArgv,
    compilerOptions: Readonly<ts.CompilerOptions>,
    rawOptions: RawTypeStatOptions,
): boolean => {
    if (argv.fixNoImplicitAny !== undefined) {
        return argv.fixNoImplicitAny;
    }

    if (rawOptions.fixes !== undefined && rawOptions.fixes.noImplicitAny !== undefined) {
        return rawOptions.fixes.noImplicitAny;
    }

    if (compilerOptions.noImplicitAny !== undefined) {
        return compilerOptions.noImplicitAny;
    }

    return false;
};
