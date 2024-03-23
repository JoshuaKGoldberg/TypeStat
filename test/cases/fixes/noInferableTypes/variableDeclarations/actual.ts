(function () {
	class Parent { parent = true; }
	class Child extends Parent { child = true; }

	// Inferable const literals
	const constInferableBoolean = false;
	const constInferableNull = null;
	const constInferableNumber = 0;
	const constInferableRegExp = /./;
	const constInferableString = "";
	const constInferableUndefined = undefined;

	// Inferable let literals
	let letInferableBoolean = false;
	let letInferableNull = null;
	let letInferableNumber = 0;
	let letInferableRegExp = /./;
	let letInferableString = "";
	let letInferableUndefined = undefined;

	// Inferable const arrays
	const constInferableBooleans = [false];
	const constInferableNulls = [null];
	const constInferableNumbers = [0];
	const constInferableRegExps = [/./];
	const constInferableStrings = [""];
	const constInferableUndefineds = [undefined];

	// Inferable let arrays
	let letInferableBooleans = [false];
	let letInferableNulls = [null];
	let letInferableNumbers = [0];
	let letInferableRegExps = [/./];
	let letInferableStrings = [""];
	let letInferableUndefineds = [undefined];

	// Inferable const multi-type arrays
	const constInferableNullOrStrings = [null, ""];
	const constInferableNumberOrRegExps = [0, /./];

	// Inferable let multi-type arrays
	let letInferableNullOrStrings = [null, ""];
	let letInferableNumberOrRegExps = [0, /./];

	// Non-inferable const multi-type arrays
	const constNonInferableNullOrStrings = [null];
	const constNonInferableNumberOrRegExps = [0];

	// Non-inferable let multi-type arrays
	let letNonInferableNullOrStrings: (null | string)[] = [null];
	let letNonInferableNumberOrRegExps: (number | RegExp)[] = [0];


	// Class instances

	// Inferable const direct class instances
	const constTakesParent = new Parent();
	const constTakesChild = new Child();

	// Inferable let direct class instances
	let letTakesParent = new Parent();
	let letTakesChild = new Child();

	// Non-inferable const direct class instances
	const constTakesParentAsChild = new Child();

	// Non-inferable let direct class instances
	let letTakesParentAsChild: Parent = new Child();

	// Non-inferable const union class instances
	const constTakesParentOrChildAsParent = new Parent();
	const constTakesParentOrChildAsChild = new Child();
	const constTakesParentOrUndefinedAsParent = new Parent();
	const constTakesParentOrUndefinedAsChild = new Child();
	const constTakesChildOrUndefinedAsChild = new Child();

	// Non-inferable let union class instances
	let letTakesParentOrChildAsParent: Parent | Child = new Parent();
	let letTakesParentOrChildAsChild: Parent | Child = new Child();
	let letTakesParentOrUndefinedAsParent: Parent | undefined = new Parent();
	let letTakesParentOrUndefinedAsChild: Parent | undefined = new Child();
	let letTakesChildOrUndefinedAsChild: Child | undefined = new Child();
})();