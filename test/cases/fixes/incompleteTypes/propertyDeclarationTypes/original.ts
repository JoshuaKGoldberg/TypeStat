(function () {
    class WithMissingString {
        property;
    }
    new WithMissingString().property = "abc";

    class WithExplicitString {
        property: string;
    }
    new WithMissingString().property = "abc";

    class WithMissingStringOrNumber {
        property;
    }
    function setWithMissingStringOrNumber(instance: WithMissingStringOrNumber, value: string | number) {
        instance.property = value;
    }

    class WithExplicitStringMissingNumber {
        property: string;
    }
    function setWithExplicitStringMissingNumber(instance: WithExplicitStringMissingNumber, value: string | number) {
        instance.property = value;
    }

    class WithObjectProperty {
        member;

        method() {
            this.member = {
                key: true,
            }
        }
    }
})();
