/* eslint-disable @typescript-eslint/unbound-method */
import ts from "typescript";

export const createParseConfigHost = (cwd: string): ts.ParseConfigFileHost => {
	return {
		directoryExists: ts.sys.directoryExists,
		fileExists: ts.sys.fileExists,
		getCurrentDirectory: () => cwd,
		getDirectories: ts.sys.getDirectories,
		onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
			const message = ts.formatDiagnostics([diagnostic], {
				getCanonicalFileName: (fileName) => fileName,
				getCurrentDirectory: () => cwd,
				getNewLine: () => ts.sys.newLine,
			});
			throw new Error(message);
		},
		readDirectory: ts.sys.readDirectory,
		readFile: ts.sys.readFile,
		useCaseSensitiveFileNames: true,
	};
};
/* eslint-enable @typescript-eslint/unbound-method */
