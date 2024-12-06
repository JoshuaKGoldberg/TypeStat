import ts from "typescript";

import { RawTypeStatOptions } from "../types.js";

export const collectNoImplicitThis = (
	compilerOptions: Readonly<ts.CompilerOptions> | undefined,
	rawOptions: RawTypeStatOptions,
): boolean =>
	rawOptions.fixes?.noImplicitThis || compilerOptions?.noImplicitThis || false;
