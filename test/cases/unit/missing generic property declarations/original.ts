(function () {
    class OneTypeParameter<TFirst = { existing: true }> {
        first: TFirst;
    }

    class ExtendedWithNothingAdded extends OneTypeParameter {
        ignored = 0;
    }

    class ExtendingWithAdded extends OneTypeParameter {
        constructor() {
            super();
            this.first = {
                added: true,
            };
        }
    }

    class ExtendingWithExisting extends OneTypeParameter {
        constructor() {
            super();
            this.first = {
                existing: true,
            };
        }
    }

    class SkippedTypeParameter<TFirst, TSecond = { existing: true }> {
        second: TSecond;
    }

    class ExtendingWithDefault extends SkippedTypeParameter<{}> {
        constructor() {
            super();
            this.second = {
                added: true,
            };
        }
    }

    class ExtendingWithSkipped extends SkippedTypeParameter {
        constructor() {
            super();
            this.second = {
                existing: true,
            };
        }
    }
})();
