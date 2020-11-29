(function() {
    class Foo {}

    function stringOrBoolean(): string {
        return true;
    }

    function stringOrUndefined(): string | undefined {
        return undefined;
    }

    function stringOrClass(): string | Foo {
        return new Foo();
    }

    function stringOrFunction(): string {
        return () => {};
    }
})();
