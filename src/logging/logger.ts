

/**
 * Wraps process.stdout.write.
 */
export interface Logger {
    readonly stderr: NodeJS.WritableStream;
    readonly stdout: NodeJS.WritableStream;
}

/**
 * Wraps process.stdout.write.
 */
export const processLogger: Logger = {
    stderr: process.stderr,
    stdout: process.stdout,
};
