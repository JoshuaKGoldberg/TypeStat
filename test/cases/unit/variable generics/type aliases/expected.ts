(function() {
    // Arrays

    const stringArrayPushOnce: (string /* hello! */)[] = [];
    stringArrayPushOnce.push("abc");

    const stringArrayPushTwice: (string /* hello! */)[] = [];
    stringArrayPushTwice.push("abc");
    stringArrayPushTwice.push("abc");

    const stringArrayIndexOfOnce: (string /* hello! */)[] = [];
    stringArrayIndexOfOnce.indexOf("abc");

    const stringArrayIndexOfTwice: (string /* hello! */)[] = [];
    stringArrayIndexOfTwice.indexOf("abc");
    stringArrayIndexOfTwice.indexOf("abc");

    const numberArrayPushOnce: number[] = [];
    numberArrayPushOnce.push(123);

    const numberArrayPushTwice: number[] = [];
    numberArrayPushTwice.push(123);
    numberArrayPushTwice.push(123);

    const numberArrayIndexOfOnce: number[] = [];
    numberArrayIndexOfOnce.indexOf(123);

    const numberArrayIndexOfTwice: number[] = [];
    numberArrayIndexOfTwice.indexOf(123);
    numberArrayIndexOfTwice.indexOf(123);

    const numberOrStringArrayPushOnce: (number | string /* hello! */)[] = [];
    numberOrStringArrayPushOnce.push(Math.random() ? "abc" : 123);
    
    const numberOrStringArrayPushTwice: (string /* hello! */ | number)[] = [];
    numberOrStringArrayPushTwice.push("abc");
    numberOrStringArrayPushTwice.push(123);
    
    const numberOrStringArrayPushTwiceUnion: (number | string /* hello! */)[] = [];
    numberOrStringArrayPushTwiceUnion.push(Math.random() ? "abc" : 123);
    numberOrStringArrayPushTwiceUnion.push(Math.random() ? "abc" : 123);

    const numberOrStringArrayIndexOfOnce: (string /* hello! */ | number)[] = [];
    numberOrStringArrayIndexOfOnce.push("abc");
    numberOrStringArrayIndexOfOnce.push(123);

    const numberOrStringArrayIndexOfTwice: (string /* hello! */ | number)[] = [];
    numberOrStringArrayIndexOfTwice.push("abc");
    numberOrStringArrayIndexOfTwice.push(123);

    const numberOrStringArrayIndexOfTwiceUnion: (number | string /* hello! */)[] = [];
    numberOrStringArrayIndexOfTwiceUnion.push(Math.random() ? "abc" : 123);
    numberOrStringArrayIndexOfTwiceUnion.push(Math.random() ? "abc" : 123);

    const numberOrStringArrayRestArguments: (string /* hello! */ | number)[] = [];
    numberOrStringArrayRestArguments.push("abc", 123);

    const numberOrStringArraySpread: (string /* hello! */ | number)[] = [];
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

    const classesArray: (SomeClass /* world! */ | SomeOtherClass)[] = [];
    classesArray.push(new SomeClass());
    classesArray.push(new SomeOtherClass());
})();
