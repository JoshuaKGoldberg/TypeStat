(function () {
    class Parent { parent = true; }
    class Child extends Parent { child = true; }

    class ContainsInferables {
        // Inferable literals
        public inferableBoolean: boolean = false;
        public inferableNull: null = null;
        public inferableNumber: number = 0;
        public inferableRegExp: RegExp = /./;
        public inferableString: string = "";
        public inferableUndefined: undefined = undefined;

        // Inferable arrays
        public inferableBooleans: boolean[] = [false];
        public inferableNulls: null[] = [null];
        public inferableNumbers: number[] = [0];
        public inferableRegExps: RegExp[] = [/./];
        public inferableStrings: string[] = [""];
        public inferableUndefineds: undefined[] = [undefined];

        // Inferable multi-type arrays
        public inferableNullOrStrings: (null | string)[] = [null, ""];
        public inferableNumberOrRegExps: (number | RegExp)[] = [0, /./];

        // Non-inferable multi-type arrays
        public nonInferableNullOrStrings: (null | string)[] = [null];
        public nonInferableNumberOrRegExps: (number | RegExp)[] = [0];


        // Class instances

        // Inferable direct class instances
        public takesParent: Parent = new Parent();
        public takesChild: Child = new Child();
        
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
