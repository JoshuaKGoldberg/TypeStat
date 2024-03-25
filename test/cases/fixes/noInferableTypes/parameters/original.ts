(function () {
	// Inferable literals
	const inferableBoolean = (input: boolean = false) => {};
	const inferableNull = (input: null = null) => {};
	const inferableNumber = (input: number = 0) => {};
	const inferableRegExp = (input: RegExp = /./) => {};
	const inferableString = (input: string = "") => {};
	const inferableUndefined = (input: undefined = undefined) => {};

	// Inferable arrays
	const inferableBooleans = (input: boolean[] = [false]) => {};
	const inferableNulls = (input: null[] = [null]) => {};
	const inferableNumbers = (input: number[] = [0]) => {};
	const inferableRegExps = (input: RegExp[] = [/./]) => {};
	const inferableStrings = (input: string[] = [""]) => {};
	const inferableUndefineds = (input: undefined[] = [undefined]) => {};

	// Inferable multi-type arrays
	const inferableNullOrStrings = (input: (null | string)[] = [null, ""]) => {};
	const inferableNumberOrRegExps = (
		input: (number | RegExp)[] = [0, /./],
	) => {};

	// Non-inferable multi-type arrays
	const nonInferableNullOrStrings = (input: (null | string)[] = [null]) => {};
	const nonInferableNumberOrRegExps = (input: (number | RegExp)[] = [0]) => {};

	// Class instances

	class Parent {
		parent = true;
	}
	class Child extends Parent {
		child = true;
	}

	// Inferable direct class instances
	const takesParent = (parent: Parent = new Parent()) => {};
	const takesChild = (child: Child = new Child()) => {};

	// Non-inferable direct class instances
	const takesParentAsChild = (child: Parent = new Child()) => {};

	// Non-inferable union class instances
	const takesParentOrChildAsParent = (
		either: Parent | Child = new Parent(),
	) => {};
	const takesParentOrChildAsChild = (
		either: Parent | Child = new Child(),
	) => {};
	const takesParentOrUndefinedAsParent = (
		child: Parent | undefined = new Parent(),
	) => {};
	const takesParentOrUndefinedAsChild = (
		child: Parent | undefined = new Child(),
	) => {};
	const takesChildOrUndefinedAsChild = (
		child: Child | undefined = new Child(),
	) => {};
})();
