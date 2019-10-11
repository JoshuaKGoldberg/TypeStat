import * as ts from "typescript";

import { RawTypeStatTypeOptions } from "../types";

export const collectStrictNullChecks = (compilerOptions: Readonly<ts.CompilerOptions>, rawOptionTypes: RawTypeStatTypeOptions) => {
    const typeStrictNullChecks = rawOptionTypes.strictNullChecks,
        compilerStrictNullChecks = collectCompilerStrictNullChecks(compilerOptions, typeStrictNullChecks);

    return { compilerStrictNullChecks, typeStrictNullChecks };
};

const collectCompilerStrictNullChecks = (
    compilerOptions: Readonly<ts.CompilerOptions>,
    typeStrictNullChecks: boolean | undefined,
): boolean => {
    if (typeStrictNullChecks !== undefined) {
        return typeStrictNullChecks;
    }

    if (compilerOptions.strictNullChecks !== undefined) {
        return compilerOptions.strictNullChecks;
    }

    if (compilerOptions.strict !== undefined) {
        return compilerOptions.strict;
    }

    return false;
};
