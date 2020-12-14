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
        property: string | TODO_1_0;
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

    class WithIncompleteObjectProperty {
        member: string | TODO_0_1;

        method() {
            this.member = '';
            this.member = {
                key: true,
            }
        }
    }

    class WithIncompleteNestedObjectProperty {
        member: string | TODO_0_1;

        method() {
            this.member = '';
            this.member = {
                middle: {
                    deepKey: true,
                },
                middleKey: 0,
            }
        }
    }
})();
