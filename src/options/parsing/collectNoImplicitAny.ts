import ts from "typescript";

import { RawTypeStatOptions } from "../types.js";

export const collectNoImplicitAny = (
	compilerOptions: Readonly<ts.CompilerOptions>,
	rawOptions: RawTypeStatOptions,
): boolean => {
	if (rawOptions.fixes?.noImplicitAny !== undefined) {
		return rawOptions.fixes.noImplicitAny;
	}

	if (compilerOptions.noImplicitAny !== undefined) {
		return compilerOptions.noImplicitAny;
	}

	return false;
};
