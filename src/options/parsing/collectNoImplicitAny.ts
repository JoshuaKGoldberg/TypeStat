import ts from "typescript";

import { RawTypeStatOptions } from "../types.js";

export const collectNoImplicitAny = (
	compilerOptions: Readonly<ts.CompilerOptions>,
	rawOptions: RawTypeStatOptions,
): boolean =>
	rawOptions.fixes?.noImplicitAny ||
	compilerOptions.noImplicitAny ||
	compilerOptions.strict ||
	false;
