(function () {
    
    // Internal declarations
    class Abc {
        givenNumber: number;
        givenNumberOrUndefined: number;
        givenUndefined: number;

        givenTwiceSame: number;
        
        givenTwiceDifferent: number;

        def() {
            this.givenNumber = 1;
            this.givenNumberOrUndefined = (1 as number | undefined)!;
            this.givenUndefined = undefined!;

            this.givenTwiceSame = 1;
            this.givenTwiceSame = 1;

            this.givenTwiceDifferent = 1;
            this.givenTwiceDifferent = undefined!;
        }
    }

    // External declarations

    class Container {
        givenUndefined: string = "";

        givenUndefinedHasNull: string | null = "";

        givenNull: string = "";

        givenNullHasUndefined: string | undefined = "";

        givenString: string = "";

        givenStringHasNull: string | null = "";

        givenStringHasUndefined: string | undefined = "";

        setToUndefined: string = undefined;

        setToUndefinedHasNull: string | null = undefined;

        setToNull: string = null;

        setToNullHasUndefined: string | undefined = null;

        setToString: string = "";

        setToStringHasUndefined: string | undefined = "";

        setToStringHasNull: string | null = "";
    }

    const container = new Container();

    container.givenUndefined = undefined!;
    container.givenUndefinedHasNull = undefined!;
    container.givenNull = null!;
    container.givenNullHasUndefined = null!;
    container.givenString = "";
    container.givenStringHasNull = "";
    container.givenStringHasNull = "";
})();
