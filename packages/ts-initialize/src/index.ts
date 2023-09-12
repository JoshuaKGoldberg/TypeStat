import { createTSConfig } from "./steps/createTSConfig/index.js";
import { installMissingTypes } from "./steps/installMissingTypes/index.js";
import { renameFileExtensions } from "./steps/renameFileExtensions/index.js";
import { rewriteImportExtensions } from "./steps/rewriteImportExtensions/index.js";
import { rewriteRequiresAsImports } from "./steps/rewriteRequiresAsImports/index.js";
import { TSInitializeOptions } from "./types.js";

export async function runTSInitialize(options: TSInitializeOptions) {
	for (const [message, step] of [
		["Creating TSConfig", createTSConfig],
		["Renaming files with TypeScript extensions", renameFileExtensions],
		["Rewriting require()s as ESM imports", rewriteRequiresAsImports],
		["Rewriting imports' file extensions", rewriteImportExtensions],
		["Installing missing @types/ packages", installMissingTypes],
	] as const) {
		options.output.stdout(`${message}...\n`);

		try {
			await step(options);
		} catch (error) {
			options.output.stderr(`${error}\n`);
			return 1;
		}

		options.output.stdout(`Done.\n`);
	}

	return 0;
}
