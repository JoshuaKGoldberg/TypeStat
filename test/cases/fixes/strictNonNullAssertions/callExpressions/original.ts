(function () {
	// Direct calls

	function oneParameterStringDirect(abc: string) {}
	oneParameterStringDirect("");

	function oneParameterStringBecomesNullDirect(abc: string) {}
	oneParameterStringBecomesNullDirect(null);

	function oneParameterStringBecomesNullOrUndefinedDirect(abc: string) {}
	oneParameterStringBecomesNullOrUndefinedDirect(null);

	function oneParameterStringBecomesUndefinedDirect(abc: string) {}
	oneParameterStringBecomesUndefinedDirect(undefined);

	function twoParametersStringDirect(abc: string, def: string) {}
	twoParametersStringDirect("", "");

	function twoParametersStringBecomesNullDirect(abc: string, def: string) {}
	twoParametersStringBecomesNullDirect(null, null);

	function twoParametersStringBecomesNullOrUndefinedDirect(
		abc: string,
		def: string,
	) {}
	twoParametersStringBecomesNullOrUndefinedDirect(null, undefined);

	function twoParametersStringBecomesUndefinedDirect(
		abc: string,
		def: string,
	) {}
	twoParametersStringBecomesUndefinedDirect(undefined, undefined);

	function takesStringFromAny(value: string) {}
	function givesAnyToString(maybe: any | undefined) {
		takesStringFromAny(maybe);
	}

	function takesAnyFromString(value: any) {}
	function givesStringToAny(maybe: string | undefined) {
		takesAnyFromString(maybe);
	}

	function takesString(abc: string) {}
	takesString(null);
	takesString(undefined);
	takesString(null as null | undefined);
	takesString(undefined as null | undefined);
	takesString("" as string | null);
	takesString("" as string | undefined);
	takesString("" as string | null | undefined);

	// test adds `!` to value here, but it has no effect
	let emptyExplicitSibling: undefined = undefined;
	let emptyImplicitSibling = undefined;
	let emptyExplicitChild: undefined = undefined;
	let emptyImplicitChild = undefined;
	let textSibling: string | undefined = "";
	let textChild: string | undefined = "";

	takesString(emptyExplicitSibling);
	takesString(emptyImplicitSibling);
	takesString(textSibling);

	function innerCalling() {
		takesString(emptyExplicitChild);
		takesString(emptyImplicitChild);
		takesString(textChild);
	}

	// Function results

	function createsStringOrNull(): string | null {
		return null;
	}

	const createsStringOrUndefined = (): string | undefined => undefined;

	function oneParameterStringBecomesNullIndirect(abc: string) {}
	oneParameterStringBecomesNullIndirect(createsStringOrNull());

	const oneParameterStringBecomesUndefinedIndirect = (abc: string) => {};
	oneParameterStringBecomesUndefinedIndirect(createsStringOrUndefined());
})();
