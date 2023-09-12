(function () {
	class Parent {
		parent = true;
	}
	class Child extends Parent {
		child = true;
	}

	class ContainsInferables {
		// Inferable literals
		public inferableBoolean = false;
		public inferableNull = null;
		public inferableNumber = 0;
		public inferableRegExp = /./;
		public inferableString = "";
		public inferableUndefined = undefined;

		// Inferable arrays
		public inferableBooleans = [false];
		public inferableNulls = [null];
		public inferableNumbers = [0];
		public inferableRegExps = [/./];
		public inferableStrings = [""];
		public inferableUndefineds = [undefined];

		// Inferable multi-type arrays
		public inferableNullOrStrings = [null, ""];
		public inferableNumberOrRegExps = [0, /./];

		// Non-inferable multi-type arrays
		public nonInferableNullOrStrings: (null | string)[] = [null];
		public nonInferableNumberOrRegExps: (number | RegExp)[] = [0];

		// Class instances

		// Inferable direct class instances
		public takesParent = new Parent();
		public takesChild = new Child();

		// Non-inferable direct class instances
		public takesParentAsChild: Parent = new Child();

		// Non-inferable union class instances
		public takesParentOrChildAsParent: Parent | Child = new Parent();
		public takesParentOrChildAsChild: Parent | Child = new Child();
		public takesParentOrUndefinedAsParent: Parent | undefined = new Parent();
		public takesParentOrUndefinedAsChild: Parent | undefined = new Child();
		public takesChildOrUndefinedAsChild: Child | undefined = new Child();
	}
})();
