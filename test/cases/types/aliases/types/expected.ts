{
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

    function stringOrFunction(): string | __function {
        return () => {};
    }
}
