/**
 * Wraps process.stderr and process.stdout.
 */
export interface Logger {
    readonly stderr: NodeJS.WritableStream;
    readonly stdout: NodeJS.WritableStream;
}

/**
 * Wraps process.stderr and process.stdout.
 */
export const processLogger: Logger = {
    stderr: process.stderr,
    stdout: process.stdout,
};
