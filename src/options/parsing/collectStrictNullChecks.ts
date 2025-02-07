import ts from "typescript";

import { RawTypeStatOptions } from "../types.js";

/** If strictNullChecks enabled either in typestat config or in tsconfig. */
export const collectStrictNullChecks = (
	compilerOptions: Readonly<ts.CompilerOptions>,
	rawOptions: RawTypeStatOptions,
): boolean =>
	rawOptions.types?.strictNullChecks ||
	compilerOptions.strictNullChecks ||
	compilerOptions.strict ||
	false;
