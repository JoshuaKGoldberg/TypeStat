(function () {
	// the return type of this function should not be updated
	function one(): string {
// @ts-expect-error -- TODO: Type 'undefined' is not assignable to type 'string'.
		return undefined;
	}

	function two(): string | undefined {
		return undefined;
	}
})();
