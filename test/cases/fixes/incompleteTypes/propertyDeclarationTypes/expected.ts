(function () {
    class WithMissingString {
        property: string;
    }
    new WithMissingString().property = "abc";

    class WithExplicitString {
        property: string;
    }
    new WithMissingString().property = "abc";

    class WithMissingStringOrNumber {
        property: number | string;
    }
    function setWithMissingStringOrNumber(instance: WithMissingStringOrNumber, value: string | number) {
        instance.property = value;
    }

    class WithExplicitStringMissingNumber {
        property: string | number;
    }
    function setWithExplicitStringMissingNumber(instance: WithExplicitStringMissingNumber, value: string | number) {
        instance.property = value;
    }
})();
