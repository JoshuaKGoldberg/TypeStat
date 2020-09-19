(function() {
    // Arrays

    const stringArrayPushOnce = [];
    stringArrayPushOnce.push("abc");

    const stringArrayPushTwice = [];
    stringArrayPushTwice.push("abc");
    stringArrayPushTwice.push("abc");

    const stringArrayIndexOfOnce = [];
    stringArrayIndexOfOnce.indexOf("abc");

    const stringArrayIndexOfTwice = [];
    stringArrayIndexOfTwice.indexOf("abc");
    stringArrayIndexOfTwice.indexOf("abc");

    const numberArrayPushOnce = [];
    numberArrayPushOnce.push(123);

    const numberArrayPushTwice = [];
    numberArrayPushTwice.push(123);
    numberArrayPushTwice.push(123);

    const numberArrayIndexOfOnce = [];
    numberArrayIndexOfOnce.indexOf(123);

    const numberArrayIndexOfTwice = [];
    numberArrayIndexOfTwice.indexOf(123);
    numberArrayIndexOfTwice.indexOf(123);

    const numberOrStringArrayPushOnce = [];
    numberOrStringArrayPushOnce.push(Math.random() ? "abc" : 123);
    
    const numberOrStringArrayPushTwice = [];
    numberOrStringArrayPushTwice.push("abc");
    numberOrStringArrayPushTwice.push(123);
    
    const numberOrStringArrayPushTwiceUnion = [];
    numberOrStringArrayPushTwiceUnion.push(Math.random() ? "abc" : 123);
    numberOrStringArrayPushTwiceUnion.push(Math.random() ? "abc" : 123);

    const numberOrStringArrayIndexOfOnce = [];
    numberOrStringArrayIndexOfOnce.push("abc");
    numberOrStringArrayIndexOfOnce.push(123);

    const numberOrStringArrayIndexOfTwice = [];
    numberOrStringArrayIndexOfTwice.push("abc");
    numberOrStringArrayIndexOfTwice.push(123);

    const numberOrStringArrayIndexOfTwiceUnion = [];
    numberOrStringArrayIndexOfTwiceUnion.push(Math.random() ? "abc" : 123);
    numberOrStringArrayIndexOfTwiceUnion.push(Math.random() ? "abc" : 123);

    const numberOrStringArrayRestArguments = [];
    numberOrStringArrayRestArguments.push("abc", 123);

    const numberOrStringArraySpread = [];
    numberOrStringArraySpread.push(...["abc"], ...[123]);

    // Sets

    const numberSetAddOnce = new Set();
    numberSetAddOnce.add(123);

    const stringSetAddOnce = new Set();
    stringSetAddOnce.add("abc");

    const numberOrStringSet = new Set();
    numberOrStringSet.add(123);
    numberOrStringSet.add("abc");

    // Maps

    const numberToNumberMapAddOnce = new Map();
    numberToNumberMapAddOnce.set(123, 456);

    const numberToStringMapAddOnce = new Map();
    numberToStringMapAddOnce.set(123, "abc");

    const stringToStringMapAddOnce = new Map();
    stringToStringMapAddOnce.set("abc", "def");

    const stringToNumberMapAddOnce = new Map();
    stringToNumberMapAddOnce.set("abc", 123);

    const numberOrStringToStringMap = new Map();
    numberOrStringToStringMap.set(123, "abc");
    numberOrStringToStringMap.set("abc", "def");

    // Class templates

    class SomeClass { }
    class SomeOtherClass { }

    const classesArray = [];
    classesArray.push(new SomeClass());
    classesArray.push(new SomeOtherClass());
})();
