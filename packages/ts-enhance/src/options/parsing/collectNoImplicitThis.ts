import * as ts from "typescript";

import { RawTSEnhanceOptions } from "../types.js";

export const collectNoImplicitThis = (
	compilerOptions: Readonly<ts.CompilerOptions>,
	rawOptions: RawTSEnhanceOptions,
): boolean => {
	if (rawOptions.fixes?.noImplicitThis !== undefined) {
		return rawOptions.fixes.noImplicitThis;
	}

	if (compilerOptions.noImplicitThis !== undefined) {
		return compilerOptions.noImplicitThis;
	}

	return false;
};
