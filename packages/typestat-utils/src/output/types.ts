/**
 * Writes a single line to a log file.
 */
export type WriteLogLine = (line: string) => void;

/**
 * Wraps process and logfile output.
 */
export interface ProcessOutput {
	/**
	 * Logs only to the file system logfile, if one was requested.
	 */
	readonly log?: WriteLogLine;

	/**
	 * Standard CLI output for error logs.
	 */
	readonly stderr: WriteLogLine;

	/**
	 * Standard CLI output for output logs.
	 */
	readonly stdout: WriteLogLine;
}
