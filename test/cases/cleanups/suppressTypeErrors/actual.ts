(function () {
// @ts-expect-error -- TODO: Type 'number' is not assignable to type 'string'.
	let incorrectSingle: string = 0;

// @ts-expect-error -- TODO: Property 'replace' does not exist on type 'undefined[]'. Property 'values' does not exist on type '{}'.
	let incorrectMutiple: string = [].replace() + {}.values();
})();
