/* eslint-disable @typescript-eslint/unbound-method */
import ts from "typescript";

export const createParseConfigHost = (): ts.ParseConfigHost => {
	return {
		directoryExists: ts.sys.directoryExists,
		fileExists: ts.sys.fileExists,
		getCurrentDirectory: () => process.cwd(),
		getDirectories: ts.sys.getDirectories,
		readDirectory: ts.sys.readDirectory,
		readFile: ts.sys.readFile,
		useCaseSensitiveFileNames: true,
	};
};
/* eslint-enable @typescript-eslint/unbound-method */
