import { EOL } from "os";
import ts from "typescript";

export const printNewLine = ({ newLine }: ts.CompilerOptions) => {
	if (newLine === undefined) {
		return EOL;
	}

	return newLine === ts.NewLineKind.CarriageReturnLineFeed ? "\r\n" : "\n";
};
