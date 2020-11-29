(function() {
    class Foo {}

    function stringOrBoolean(): string {
        return true;
    }

    function stringOrUndefined(): string {
        return undefined;
    }

    function stringOrClass(): string {
        return new Foo();
    }

    function stringOrFunction(): string {
        return () => {};
    }

    function stringOrFunctionReturningString(): string {
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
