export const getQuickErrorSummary = (
	error: unknown,
	stackTraceLimit = Infinity,
): string => {
	if (!(error instanceof Error) || error.stack === undefined) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		return `${error}`;
	}

	const lines = error.stack.split("\n");

	let output = lines.slice(0, stackTraceLimit).join("\n\t");

	if (lines.length > stackTraceLimit) {
		output += "\n\t    ...";
	}

	return output;
};
