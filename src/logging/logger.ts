/**
 * Wraps process.stderr and process.stdout.
 */
export interface ProcessLogger {
    readonly stderr: NodeJS.WritableStream;
    readonly stdout: NodeJS.WritableStream;
}

/**
 * Wraps process.stderr and process.stdout.
 */
export const processLogger: ProcessLogger = {
    stderr: process.stderr,
    stdout: process.stdout,
};
