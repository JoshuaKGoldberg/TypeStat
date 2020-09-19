(function () {
    // Inferable literals
    const inferableBoolean = (input = false) => { };
    const inferableNull = (input = null) => { };
    const inferableNumber = (input = 0) => { };
    const inferableRegExp = (input = /./) => { };
    const inferableString = (input = "") => { };
    const inferableUndefined = (input = undefined) => { };

    // Inferable arrays
    const inferableBooleans = (input = [false]) => { };
    const inferableNulls = (input = [null]) => { };
    const inferableNumbers = (input = [0]) => { };
    const inferableRegExps = (input = [/./]) => { };
    const inferableStrings = (input = [""]) => { };
    const inferableUndefineds = (input = [undefined]) => { };

    // Inferable multi-type arrays
    const inferableNullOrStrings = (input = [null, ""]) => { };
    const inferableNumberOrRegExps = (input = [0, /./]) => { };

    // Non-inferable multi-type arrays
    const nonInferableNullOrStrings = (input: (null | string)[] = [null]) => { };
    const nonInferableNumberOrRegExps = (input: (number | RegExp)[] = [0]) => { };


    // Class instances

    class Parent { parent = true; }
    class Child extends Parent { child = true; }

    // Inferable direct class instances
    const takesParent = (parent = new Parent()) => { };
    const takesChild = (child = new Child()) => { };
    
    // Non-inferable direct class instances
    const takesParentAsChild = (child: Parent = new Child()) => { };

    // Non-inferable union class instances
    const takesParentOrChildAsParent = (either: Parent | Child = new Parent()) => { };
    const takesParentOrChildAsChild = (either: Parent | Child = new Child()) => { };
    const takesParentOrUndefinedAsParent = (child: Parent | undefined = new Parent()) => { };
    const takesParentOrUndefinedAsChild = (child: Parent | undefined = new Child()) => { };
    const takesChildOrUndefinedAsChild = (child: Child | undefined = new Child()) => { };
})();
