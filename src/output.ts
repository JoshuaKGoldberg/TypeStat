import stripAnsi from "strip-ansi";
import { fs } from "mz";
import { EOL } from "os";

/**
 * Writes a single line to a log file.
 */
export type WriteLogLine = (line: string) => void;

/**
 * Wraps process and logfile output.
 */
export interface ProcessOutput {
    /**
     * Logs to the file system logfile, if one was requested.
     */
    readonly log: WriteLogLine;

    /**
     * Standard CLI output for success logs.
     */
    readonly stderr: WriteLogLine;

    /**
     * Standard CLI output for error logs.
     */
    readonly stdout: WriteLogLine;
}

export const createProcessOutput = (logFile?: string): ProcessOutput => {
    const log = createLogfileOutput(logFile);

    const wrapStream = (prefix: string, stream: NodeJS.WriteStream) => {
        return (line: string) => {
            stream.write(line + EOL);
            log(stripAnsi(`[${prefix}] ${line}${EOL}`));
        };
    };

    return {
        log,
        stderr: wrapStream("stderr", process.stderr),
        stdout: wrapStream("stdout", process.stdout),
    };
};

const createLogfileOutput = (logFile?: string) => {
    if (!logFile) {
        return () => {};
    }

    const file = fs.openSync(logFile, "w");

    return (line: string) => {
        fs.appendFileSync(file, line + EOL);
    };
};
