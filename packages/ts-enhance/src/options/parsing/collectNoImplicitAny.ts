import * as ts from "typescript";

import { RawTSEnhanceOptions } from "../types.js";

export const collectNoImplicitAny = (
	compilerOptions: Readonly<ts.CompilerOptions>,
	rawOptions: RawTSEnhanceOptions,
): boolean => {
	if (rawOptions.fixes?.noImplicitAny !== undefined) {
		return rawOptions.fixes.noImplicitAny;
	}

	if (compilerOptions.noImplicitAny !== undefined) {
		return compilerOptions.noImplicitAny;
	}

	return false;
};
