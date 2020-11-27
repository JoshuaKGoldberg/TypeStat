(function () {
    class BaseWithoutGenerics { }
    class BaseWithOneGeneric<T> { constructor(t: T) { } }
    class BaseWithTwoGenerics<T, U> {constructor(t: T, u: U) {} }

    class ExtendsBaseWithout extends BaseWithoutGenerics { }
    new ExtendsBaseWithout();

    class ExtendsBaseWithOneLiteral extends BaseWithOneGeneric {
        constructor() {
            super('abc')
        }
    }

    interface OneInterface {
        property: string;
    }
    const oneInterface: OneInterface = { property: 'abc' };

    class ExtendsBaseWithOneInterface extends BaseWithOneGeneric {
        constructor() {
            super(oneInterface)
        }
    }

    type OneType = {
        property: string[];
    }
    const oneType: OneType = { property: ['a', 'b', 'c'] };

    class ExtendsBaseWithOneType extends BaseWithOneGeneric {
        constructor() {
            super(oneType)
        }
    }

    class ExtendsBaseWithTwo extends BaseWithTwoGenerics {
        constructor() {
            super(123, false)
        }
    }
})();
