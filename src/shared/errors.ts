export const getQuickErrorSummary = (error: any, stackTraceLimit = Infinity): string => {
    if (!(error instanceof Error) || error.stack === undefined) {
        return `${error}`;
    }

    const lines = error.stack.split("\n");

    let output = lines.slice(0, stackTraceLimit).join("\n\t");

    if (lines.length > stackTraceLimit) {
        output += "\n\t    ...";
    }

    return output;
};
