(function () {
    type Values = {
        alreadyDeclared: boolean;
laterAssigned?: true;
initiallyThere?: boolean;
    };

    class Container<T> {
        constructor(public values: T) { }
    }

    new Container<Values>({
        alreadyDeclared: true,
        initiallyThere: true,
    }).values.laterAssigned = true;
})();
