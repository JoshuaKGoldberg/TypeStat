(function () {
	// Primitives

	let givenUndefined = "";
	givenUndefined = undefined;

	let givenUndefinedAsString: string | undefined = "";
	givenUndefinedAsString = undefined;

	let givenUndefinedHasNull: string | null | undefined = "";
	givenUndefinedHasNull = undefined;

	let givenNullAndUndefinedHasNull: string | null | undefined = "";
	givenNullAndUndefinedHasNull = null;
	givenNullAndUndefinedHasNull = undefined;

	let givenNull = "";
	givenNull = null;

	let givenNullAsString: string | null = "";
	givenNullAsString = null;

	let givenNullHasUndefined: string | undefined | null = "";
	givenNullHasUndefined = null;

	let givenNullAndUndefinedHasUndefined: string | undefined | null = "";
	givenNullAndUndefinedHasUndefined = null;
	givenNullHasUndefined = undefined;

	let givenString;
	givenString = "";

	let givenStringAsString: string = "";
	givenStringAsString = "";

	let givenStringHasNull: string | null = "";
	givenStringHasNull = "";

	let givenStringHasUndefined: string | undefined = "";
	givenStringHasNull = "";

	let setToUndefined: string | undefined = undefined;

	let setToUndefinedHasNull: string | null | undefined = undefined;

	let setToNull: string | null = null;

	let setToNullAsNull = null;

	let setToNullHasUndefined: string | undefined | null = null;

	let setToString = "";

	let setToStringAsString: string = "";

	let setToStringHasUndefined: string | undefined = "";

	let setToStringHasNull: string | null = "";

	// Any

	let startsAnyWithString: any = "";

	let startsAnyGivenString: any;
	startsAnyGivenString = "";

	let startsAnyWithStringGivenString: any = "";
	startsAnyWithStringGivenString = "";

	let startsStringWithAny: string = {} as any;

	let startsStringGivenAny: string;
	startsStringGivenAny = {} as any;

	// Void and undefined

	let startsUndefinedWithVoid: undefined = ((): void => {})();

	let startsUndefinedGivenVoid: undefined;
	startsUndefinedGivenVoid = ((): void => {})();

	let startsVoidWithUndefined: void = undefined;

	let startsVoidGivenUndefined: void;
	startsVoidGivenUndefined = undefined;

	let resolveDeclaredVoid: (v: void) => void;
	new Promise<void>((_resolve) => {
		resolve = _resolve;
	});

	// Async

	async function _() {
		let stringFromNullImmediate: string | null = await Promise.resolve<null>(null);

		let stringFromUndefinedLater: string | undefined;
		stringFromUndefinedLater = await Promise.resolve<undefined>(undefined);
	}

	// Interfaces and classes

	interface SampleInterface {
		readonly optional?: boolean;
		readonly required: number;
	}

	class SampleClassOne implements SampleInterface {
		readonly required = 1;
	}

	class SampleClassTwo implements SampleInterface {
		readonly optional = false;
		readonly required = 2;
	}

	let onlyInterfaceImplicit = { required: 1 };
	let onlyInterfaceExplicit: SampleInterface = { required: 1 };

	let onlyClassOneImplicit = new SampleClassOne();
	let onlyClassOneExplicitClass: SampleClassOne = new SampleClassOne();
	let onlyClassOneExplicitInterface: SampleInterface = new SampleClassOne();

	let eitherClassImplicit = new SampleClassOne();
	eitherClassImplicit = new SampleClassTwo();

	let eitherClassExplicit: SampleInterface = new SampleClassOne();
	eitherClassExplicit = new SampleClassTwo();

	let eitherClassNeedsUnionImplicit = new SampleClassOne();
	eitherClassNeedsUnionImplicit = new SampleClassTwo();

	let eitherClassNeedsUnionExplicit: SampleClassOne | SampleClassTwo = new SampleClassOne();
	eitherClassNeedsUnionExplicit = new SampleClassTwo();

	let eitherClassNeedsUnionExplicitInterface: SampleInterface =
		new SampleClassOne();
	eitherClassNeedsUnionExplicitInterface = new SampleClassTwo();

	let eitherClassNeedsNullImplicit = new SampleClassOne();
	eitherClassNeedsNullImplicit = new SampleClassTwo();
	eitherClassNeedsNullImplicit = null;

	let eitherClassNeedsNullAndClassExplicit: SampleClassOne | null | SampleClassTwo =
		new SampleClassOne();
	eitherClassNeedsNullAndClassExplicit = new SampleClassTwo();
	eitherClassNeedsNullAndClassExplicit = null;

	let eitherClassNeedsUndefinedExplicit: SampleClassOne | SampleClassTwo | undefined = new SampleClassOne();
	eitherClassNeedsUndefinedExplicit = new SampleClassTwo();
	eitherClassNeedsUndefinedExplicit = undefined;

	let eitherClassNeedsUndefinedExplicitInterface: SampleInterface | undefined =
		new SampleClassOne();
	eitherClassNeedsUndefinedExplicitInterface = new SampleClassTwo();
	eitherClassNeedsUndefinedExplicitInterface = undefined;

	let eitherClassNeedsUndefinedAndClassExplicit: SampleClassOne | undefined | SampleClassTwo =
		new SampleClassOne();
	eitherClassNeedsUndefinedAndClassExplicit = new SampleClassTwo();
	eitherClassNeedsUndefinedAndClassExplicit = undefined;

	// Array setting
	let numberImplicit = [1];
	numberImplicit = [1];

	let numberExplicitPrimitive: number[] = [1];
	numberExplicitPrimitive = [1];

	let numberExplicitTemplated: Array<number> = [1];
	numberExplicitTemplated = [1] as Array<number>;

	// Array Iteration

	const iterableStrings = ["abc", "def", "ghi"];
	for (const string of iterableStrings) {
	}

	const iterableStringOrUndefineds: (string | undefined)[] = [
		"abc",
		"def",
		"ghi",
	];
	for (const stringOrUndefined of iterableStringOrUndefineds) {
	}

	// Object iteration

	const containsStrings = { a: "a", b: "b" };
	for (const key in containsStrings) {
	}

	const containsStringOrUndefineds: { [i: string]: string | undefined } = {};
	for (const key in containsStringOrUndefineds) {
	}

	// Functions

	let resolve;
	resolve = () => {};

	new Promise<void>((_resolve) => {
		resolve = _resolve;
	});
})();
