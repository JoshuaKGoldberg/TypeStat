export function fileNameIsJavaScript(fileName: string) {
	return /\.(?:c|m)?jsx?/i.test(fileName);
}
