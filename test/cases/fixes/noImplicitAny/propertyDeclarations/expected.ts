(function () {
    class Container {
        givenUndefined: string | TODO_1_0 = "";

        givenUndefinedHasNull: string | null | TODO_1_0 = "";

        givenNull: string | TODO_1_0 = "";

        givenNullHasUndefined: string | undefined | TODO_1_0 = "";

        givenString: string = "";

        givenStringHasNull: string | null = "";

        givenStringHasUndefined: string | undefined = "";

        setToUndefined: string | TODO_1_0 = undefined;

        setToUndefinedHasNull: string | null | TODO_1_0 = undefined;

        setToNull: string | TODO_1_0 = null;

        setToNullHasUndefined: string | undefined | TODO_1_0 = null;

        setToString: string = "";

        setToStringHasUndefined: string | undefined = "";

        setToStringHasNull: string | null = "";
    }

    const container = new Container();

    container.givenUndefined = undefined;
    container.givenUndefinedHasNull = undefined;
    container.givenNull = null;
    container.givenNullHasUndefined = null;
    container.givenString = "";
    container.givenStringHasNull = "";
    container.givenStringHasNull = "";
})();