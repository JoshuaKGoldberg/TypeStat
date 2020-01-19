import * as ts from "typescript";

import { RawTypeStatOptions } from "../types";

export const collectNoImplicitThis = (compilerOptions: Readonly<ts.CompilerOptions>, rawOptions: RawTypeStatOptions): boolean => {
    if (rawOptions.fixes !== undefined && rawOptions.fixes.noImplicitThis !== undefined) {
        return rawOptions.fixes.noImplicitThis;
    }

    if (compilerOptions.noImplicitThis !== undefined) {
        return compilerOptions.noImplicitThis;
    }

    return false;
};
