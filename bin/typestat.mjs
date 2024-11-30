#!/usr/bin/env node

// eslint-disable-next-line n/no-missing-import
import { runCli } from "../lib/cli/runCli.js";

runCli(process.argv)
	.then((resultStatus) => {
		if (resultStatus !== 0) {
			process.exitCode = 1;
		}
	})
	.catch((error) => {
		console.error("Error in TypeStat: " + error);
		process.exitCode = 1;
	});