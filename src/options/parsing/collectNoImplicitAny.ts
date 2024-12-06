import ts from "typescript";

import { RawTypeStatOptions } from "../types.js";

export const collectNoImplicitAny = (
	compilerOptions: Readonly<ts.CompilerOptions> | undefined,
	rawOptions: RawTypeStatOptions,
): boolean =>
	rawOptions.fixes?.noImplicitAny || compilerOptions?.noImplicitAny || false;
