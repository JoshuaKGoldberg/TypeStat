import ts from "typescript";

import { RawTypeStatOptions } from "../types.js";

export const collectNoImplicitAny = (
	compilerOptions: Readonly<ts.CompilerOptions> | undefined,
	rawOptions: RawTypeStatOptions,
): boolean =>
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	rawOptions.fixes?.noImplicitAny || compilerOptions?.noImplicitAny || false;
