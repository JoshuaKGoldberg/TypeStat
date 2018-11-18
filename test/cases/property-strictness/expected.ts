class Container {
    givenUndefined: string | undefined /* property-strictness */ = "";

    givenUndefinedHasNull: string | null | undefined /* property-strictness */ = "";

    givenNull: string | null /* property-strictness */ = "";

    givenNullHasUndefined: string | undefined | null /* property-strictness */ = "";

    givenString: string = "";

    givenStringHasNull: string | null = "";

    givenStringHasUndefined: string | undefined = "";

    setToUndefined: string | undefined /* property-strictness */ = undefined;

    setToUndefinedHasNull: string | null | undefined /* property-strictness */ = undefined;

    setToNull: string | null /* property-strictness */ = null;

    setToNullHasUndefined: string | undefined | null /* property-strictness */ = null;

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
