(function () {
    function takesNumber(one: number) { }
    takesNumber(1);

    function takesStringThenBoolean(one: string, two: boolean) { }
    takesStringThenBoolean('abc', true);

    function takesStringOrBoolean(one: boolean | string) { }
    function passesStringOrBoolean(input: string | boolean) {
        takesStringOrBoolean(input);
    }
})()