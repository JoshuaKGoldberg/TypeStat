/**
 * Wraps process.stdout.write.
 */
export interface Logger {
    readonly write: (text: string) => void;
}

/**
 * Wraps process.stdout.write.
 */
export const processLogger: Logger = {
    write: process.stdout.write,
};
