import * as ts from "typescript";

import { TypeStatArgv } from "../../index";
import { RawTypeStatOptions } from "../types";

export const collectNoImplicitThis = (
    argv: TypeStatArgv,
    compilerOptions: Readonly<ts.CompilerOptions>,
    rawOptions: RawTypeStatOptions,
): boolean => {
    if (argv.fixNoImplicitThis !== undefined) {
        return argv.fixNoImplicitThis;
    }

    if (rawOptions.fixes !== undefined && rawOptions.fixes.noImplicitThis !== undefined) {
        return rawOptions.fixes.noImplicitThis;
    }

    if (compilerOptions.noImplicitThis !== undefined) {
        return compilerOptions.noImplicitThis;
    }

    return false;
};
