import ts from "typescript";

export const createParseConfigHost = (): ts.ParseConfigHost => {
	return {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		directoryExists: ts.sys.directoryExists,
		// eslint-disable-next-line @typescript-eslint/unbound-method
		fileExists: ts.sys.fileExists,
		getCurrentDirectory: () => process.cwd(),
		// eslint-disable-next-line @typescript-eslint/unbound-method
		getDirectories: ts.sys.getDirectories,
		// eslint-disable-next-line @typescript-eslint/unbound-method
		readDirectory: ts.sys.readDirectory,
		// eslint-disable-next-line @typescript-eslint/unbound-method
		readFile: ts.sys.readFile,
		useCaseSensitiveFileNames: true,
	};
};
