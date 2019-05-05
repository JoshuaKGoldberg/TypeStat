(function () {
    class OneTypeParameter<TFirst = { existing: true }> {
        first: TFirst;
    }

type ExtendingWithAddedTFirst = {
added?: boolean;
};

    class ExtendingWithAdded extends OneTypeParameter<ExtendingWithAddedTFirst> {
        constructor() {
            super();
            this.first = {
                added: true,
            };
        }
    }

type ExtendingWithExistingTFirst = {
added?: boolean;
};

    class ExtendingWithExisting extends OneTypeParameter<ExtendingWithExistingTFirst> {
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



    class ExtendingWithDefault extends SkippedTypeParameter<{}, {}> {
        constructor() {
            super();
            this.second = {
                existing: true,
            };
        }
    }



    class ExtendingWithSkipped extends SkippedTypeParameter<{}> {
        constructor() {
            super();
            this.second = {
                existing: true,
            };
        }
    }
})();
