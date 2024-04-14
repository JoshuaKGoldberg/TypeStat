import ts from "typescript";

import { RawTypeStatTypeOptions } from "../types.js";

export const collectStrictNullChecks = (
	compilerOptions: Readonly<ts.CompilerOptions> | undefined,
	rawOptionTypes: RawTypeStatTypeOptions | undefined,
): boolean =>
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	rawOptionTypes?.strictNullChecks ||
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	compilerOptions?.strictNullChecks ||
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	compilerOptions?.strict ||
	false;
