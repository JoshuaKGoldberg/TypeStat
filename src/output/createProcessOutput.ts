import * as fs from "node:fs";
import { EOL } from "os";
import stripAnsi from "strip-ansi";

import { ProcessOutput } from "./types.js";

export const createProcessOutput = (logFile?: string): ProcessOutput => {
	const log = createLogfileOutput(logFile);

	const wrapStream = (prefix: string, stream: NodeJS.WriteStream) => {
		return (line: string) => {
			stream.write(line + EOL);
			log?.(
				stripAnsi(
					`[${prefix}] ${line.replace(/^\r\n|\r|\n/g, "").replace(/\r\n|\r|\n$/g, "")}`,
				),
			);
		};
	};

	return {
		log: (line: string) => log?.(`[log] ${line}`),
		stderr: wrapStream("stderr", process.stderr),
		stdout: wrapStream("stdout", process.stdout),
	};
};

const createLogfileOutput = (logFile?: string) => {
	if (!logFile) {
		return undefined;
	}

	const file = fs.openSync(logFile, "w");

	return (line: string) => {
		fs.appendFileSync(file, line + EOL);
	};
};
