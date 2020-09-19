(function() {
    // Arrays

    const stringArrayPushOnce: string[] = [];
    stringArrayPushOnce.push("abc");

    const stringArrayPushTwice: string[] = [];
    stringArrayPushTwice.push("abc");
    stringArrayPushTwice.push("abc");

    const stringArrayIndexOfOnce: string[] = [];
    stringArrayIndexOfOnce.indexOf("abc");

    const stringArrayIndexOfTwice: string[] = [];
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

    const numberOrStringArrayPushOnce: (number | string)[] = [];
    numberOrStringArrayPushOnce.push(Math.random() ? "abc" : 123);
    
    const numberOrStringArrayPushTwice: (string | number)[] = [];
    numberOrStringArrayPushTwice.push("abc");
    numberOrStringArrayPushTwice.push(123);
    
    const numberOrStringArrayPushTwiceUnion: (number | string)[] = [];
    numberOrStringArrayPushTwiceUnion.push(Math.random() ? "abc" : 123);
    numberOrStringArrayPushTwiceUnion.push(Math.random() ? "abc" : 123);

    const numberOrStringArrayIndexOfOnce: (string | number)[] = [];
    numberOrStringArrayIndexOfOnce.push("abc");
    numberOrStringArrayIndexOfOnce.push(123);

    const numberOrStringArrayIndexOfTwice: (string | number)[] = [];
    numberOrStringArrayIndexOfTwice.push("abc");
    numberOrStringArrayIndexOfTwice.push(123);

    const numberOrStringArrayIndexOfTwiceUnion: (number | string)[] = [];
    numberOrStringArrayIndexOfTwiceUnion.push(Math.random() ? "abc" : 123);
    numberOrStringArrayIndexOfTwiceUnion.push(Math.random() ? "abc" : 123);

    const numberOrStringArrayRestArguments: (string | number)[] = [];
    numberOrStringArrayRestArguments.push("abc", 123);

    const numberOrStringArraySpread: (string | number)[] = [];
    numberOrStringArraySpread.push(...["abc"], ...[123]);

    // Sets

    const numberSetAddOnce: Set<number> = new Set();
    numberSetAddOnce.add(123);

    const stringSetAddOnce: Set<string> = new Set();
    stringSetAddOnce.add("abc");

    const numberOrStringSet: Set<number | string> = new Set();
    numberOrStringSet.add(123);
    numberOrStringSet.add("abc");

    // Maps

    const numberToNumberMapAddOnce: Map<number, number> = new Map();
    numberToNumberMapAddOnce.set(123, 456);

    const numberToStringMapAddOnce: Map<number, string> = new Map();
    numberToStringMapAddOnce.set(123, "abc");

    const stringToStringMapAddOnce: Map<string, string> = new Map();
    stringToStringMapAddOnce.set("abc", "def");

    const stringToNumberMapAddOnce: Map<string, number> = new Map();
    stringToNumberMapAddOnce.set("abc", 123);

    const numberOrStringToStringMap: Map<number | string, string> = new Map();
    numberOrStringToStringMap.set(123, "abc");
    numberOrStringToStringMap.set("abc", "def");

    // Class templates

    class SomeClass { }
    class SomeOtherClass { }

    const classesArray: (SomeClass | SomeOtherClass)[] = [];
    classesArray.push(new SomeClass());
    classesArray.push(new SomeOtherClass());
})();
