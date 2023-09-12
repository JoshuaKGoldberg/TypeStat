import * as path from "node:path";
import { parseArgs } from "node:util";
import { createProcessOutput } from "typestat-utils";

import { TSEnhanceArgv } from "./types.js";

export const parseEnhanceArgv = (
	args: string[],
	cwd: string,
): TSEnhanceArgv => {
	const { values } = parseArgs({
		args,
		options: {
			config: { short: "c", type: "string" },
			logfile: { short: "l", type: "string" },
			project: { short: "p", type: "string" },
			version: { short: "V", type: "boolean" },
		},
	});

	return {
		config: values.config,
		cwd,
		output: createProcessOutput(values.logfile),
		project: values.project ?? path.join(cwd, "tsconfig.json"),
		version: !!values.version,
	};
};
