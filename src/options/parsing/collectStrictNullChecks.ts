import ts from "typescript";

import { RawTypeStatTypeOptions } from "../types.js";

export const collectStrictNullChecks = (
	compilerOptions: Readonly<ts.CompilerOptions> | undefined,
	rawOptionTypes: RawTypeStatTypeOptions,
): boolean =>
	rawOptionTypes.strictNullChecks ||
	compilerOptions?.strictNullChecks ||
	compilerOptions?.strict ||
	false;
