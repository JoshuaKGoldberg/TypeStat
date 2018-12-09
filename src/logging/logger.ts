/**
 * Wraps process.stdout.write.
 */
export interface Logger {
    readonly stderr: (text: string) => void;
    readonly stdout: (text: string) => void;
}

/**
 * Wraps process.stdout.write.
 */
export const processLogger: Logger = {
    stderr: process.stderr.write.bind(process.stderr),
    stdout: process.stdout.write.bind(process.stdout),
};
