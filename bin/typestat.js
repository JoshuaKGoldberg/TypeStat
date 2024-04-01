#!/usr/bin/env node

const { runCli } = require("../lib/cli/runCli.js");

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
