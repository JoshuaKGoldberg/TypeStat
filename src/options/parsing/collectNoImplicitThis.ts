import ts from "typescript";

import { RawTypeStatOptions } from "../types.js";

export const collectNoImplicitThis = (
	compilerOptions: Readonly<ts.CompilerOptions>,
	rawOptions: RawTypeStatOptions,
): boolean =>
	rawOptions.fixes?.noImplicitThis ||
	compilerOptions.noImplicitThis ||
	compilerOptions.strict ||
	false;
