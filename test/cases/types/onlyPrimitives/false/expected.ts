(function() {
    const receivesNumberOrString = (param) => param;
    receivesNumberOrString(0);
    receivesNumberOrString("");

    class Foo {}
    class Bar {}

    const foo = new Foo();
    const bar = new Bar();

    const receivesFoo = (param) => param;
    receivesFoo(foo);

    const receivesFooOrBar = (param) => param;
    receivesFooOrBar(foo);
    receivesFooOrBar(bar);

    const receivesFooOrString = (param) => param;
    receivesFooOrString(new Foo());
    receivesFooOrString("");

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

    let instance;
    instance = new Foo();

    instance.memberText = "";
    instance.memberTextOrNumber = "";
    instance.memberTextOrArray = ["foo"];

    let text;
    text = "";

    let textOrInstance;
    textOrInstance = "";
    textOrInstance = new Foo();

    let instanceEither;
    instanceEither = new Foo();
    instanceEither = new Bar();

    let instanceEitherOrText;
    instanceEitherOrText = new Foo();
    instanceEitherOrText = new Bar();
    instanceEitherOrText = "";

    function receivesText(text) {}
    receivesText(text);

    function receivesTextOrInstance(text) {}
    receivesTextOrInstance(text);

    function receivesInstanceEither(either: Bar | Bar) {}
    receivesInstanceEither(instanceEither);

    function receivesInstanceEitherOrText(either: Bar | Bar) {}
    receivesInstanceEitherOrText(instanceEither);
})();
