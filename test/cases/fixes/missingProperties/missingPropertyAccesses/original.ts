(function () {
    class Abc {
        def() {
            this.givenNumber = 1;
            this.givenNumberOrUndefined = 1 as number | undefined;
            this.givenUndefined = undefined;

            this.givenTwiceSame = 1;
            this.givenTwiceSame = 1;

            this.givenTwiceDifferent = 1;
            this.givenTwiceDifferent = undefined;
        }

        set withGetterAndSetter(value: string) {
            this._withGetterAndSetter = value;
        }

        get withGetterAndSetter() {
            return this._withGetterAndSetter;
        }

    }
})();