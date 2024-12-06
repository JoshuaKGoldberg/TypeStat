// @ts-expect-error -- TODO: This module can only be default-imported using the 'esModuleInterop' flag
import ts from "typescript";
// @ts-expect-error -- TODO: Cannot find module './typestat.json'. Consider using '--resolveJsonModule' to import module with '.json' extension.
import config from "./typestat.json";

(function () {
// @ts-expect-error -- TODO: Type 'number' is not assignable to type 'string'.
	let incorrectSingle: string = 0;

// @ts-expect-error -- TODO: Property 'replace' does not exist on type 'undefined[]'. Property 'values' does not exist on type '{}'.
	let incorrectMultiple: string = [].replace() + {}.values();
})();
