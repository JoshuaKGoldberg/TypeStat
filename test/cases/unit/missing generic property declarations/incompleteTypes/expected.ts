(function () {
    class OneTypeParameter<TFirst = { existing: true }> {
        first: TFirst;
    }

type ExtendingWithAddedFirst = {
added?: boolean;
};

    class ExtendingWithAdded extends OneTypeParameter<ExtendingWithAddedFirst> {
        constructor() {
            super();
            this.first = {
                added: true,
            };
        }
    }

type ExtendingWithExistingFirst = {
added?: boolean;
};

    class ExtendingWithExisting extends OneTypeParameter<ExtendingWithExistingFirst> {
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

type ExtendingWithDefaultSecond = {
added?: boolean;
};

    class ExtendingWithDefault extends SkippedTypeParameter<{}, ExtendingWithDefaultSecond> {
        constructor() {
            super();
            this.second = {
                added: true,
            };
        }
    }

type ExtendingWithSkippedSecond = {
added?: boolean;
};

    class ExtendingWithSkipped extends SkippedTypeParameter<{}, ExtendingWithSkippedSecond> {
        constructor() {
            super();
            this.second = {
                existing: true,
            };
        }
    }
})();
