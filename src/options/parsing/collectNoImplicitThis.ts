import ts from "typescript";

import { RawTypeStatOptions } from "../types.js";

export const collectNoImplicitThis = (
	compilerOptions: Readonly<ts.CompilerOptions>,
	rawOptions: RawTypeStatOptions,
): boolean => {
	if (rawOptions.fixes?.noImplicitThis !== undefined) {
		return rawOptions.fixes.noImplicitThis;
	}

	if (compilerOptions.noImplicitThis !== undefined) {
		return compilerOptions.noImplicitThis;
	}

	return false;
};
