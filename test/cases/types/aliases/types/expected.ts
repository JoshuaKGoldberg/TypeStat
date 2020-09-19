(function() {
    class Foo {}

    function stringOrBoolean(): string | boolean {
        return true;
    }

    function stringOrUndefined(): string | undefined /* todo: undefined */ {
        return undefined;
    }

    function stringOrClass(): string | /* Foo */ Foo {
        return new Foo();
    }

    function stringOrFunction(): string | (() => void) {
        return () => {};
    }

    function stringOrFunctionReturningString(): string | (() => string) {
        return () => {
            return "";
        };
    }

    function multipleFunctionTypes(): () => void {
        return Math.random() > 0.5
            ? ((() => {}) as (() => void))
            : ((() => {}) as (() => undefined))
    }
})();
