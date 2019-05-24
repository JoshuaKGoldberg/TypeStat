(function() {
    class Foo {}

    function stringOrBoolean(): string {
        return true;
    }

    function stringOrUndefined(): string {
        return undefined! /* TODO */;
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
})();
