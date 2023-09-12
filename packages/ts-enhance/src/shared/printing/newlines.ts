import { EOL } from "node:os";
import * as ts from "typescript";

export const printNewLine = ({ newLine }: ts.CompilerOptions) => {
	if (newLine === undefined) {
		return EOL;
	}

	return newLine === ts.NewLineKind.CarriageReturnLineFeed ? "\r\n" : "\n";
};
