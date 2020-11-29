(function () {
    class BaseWithoutGenerics { }
    class BaseWithOneGeneric<T> { constructor(t: T) { } }
    class BaseWithTwoGenerics<T, U> {constructor(t: T, u: U) {} }

    class ExtendsBaseWithout extends BaseWithoutGenerics { }
    new ExtendsBaseWithout();



    class ExtendsBaseWithOneLiteral extends BaseWithOneGeneric<string> {
        constructor() {
            super('abc')
        }
    }

    interface OneInterface {
        property: string;
    }
    const oneInterface: OneInterface = { property: 'abc' };



    class ExtendsBaseWithOneInterface extends BaseWithOneGeneric<{ property: string }> {
        constructor() {
            super(oneInterface)
        }
    }

    type OneType = {
        property: string[];
    }
    const oneType: OneType = { property: ['a', 'b', 'c'] };



    class ExtendsBaseWithOneType extends BaseWithOneGeneric<OneType> {
        constructor() {
            super(oneType)
        }
    }



    class ExtendsBaseWithTwo extends BaseWithTwoGenerics<number, boolean> {
        constructor() {
            super(123, false)
        }
    }
})();
