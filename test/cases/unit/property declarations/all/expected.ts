(function() {
    class Container {
        givenUndefined: string | undefined = "";

        givenUndefinedHasNull: string | null | undefined = "";

        givenNull: string | null /* todo: null */ = "";

        givenNullHasUndefined: string | undefined | null /* todo: null */ = "";

        givenString: string = "";

        givenStringHasNull: string | null = "";

        givenStringHasUndefined: string | undefined = "";

        setToUndefined: string | undefined = undefined;

        setToUndefinedHasNull: string | null | undefined = undefined;

        setToNull: string | null /* todo: null */ = null;

        setToNullHasUndefined: string | undefined | null /* todo: null */ = null;

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
