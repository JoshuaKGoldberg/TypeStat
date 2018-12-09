class Container {
    givenUndefined: string = "";

    givenUndefinedHasNull: string | null = "";

    givenNull: string = "";

    givenNullHasUndefined: string | undefined = "";

    givenString: string = "";

    givenStringHasNull: string | null = "";

    givenStringHasUndefined: string | undefined = "";

    setToUndefined: string | undefined = undefined;

    setToUndefinedHasNull: string | null | undefined = undefined;

    setToNull: string | null = null;

    setToNullHasUndefined: string | undefined | null = null;

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
