{
    function _(
        useForString: string,
        useForStringOrNull: string | null,
        useForStringOrUndefined: string | undefined,
        useForStringOrNullOrUndefined: string | null | undefined,
    ) {
        useForString.length;
        useForStringOrNull.length;
        useForStringOrUndefined.length;
        useForStringOrNullOrUndefined.length;

        let stringExplicit: string = "";
        stringExplicit.length;

        let stringImplicit = "";
        stringImplicit.length;

        let stringOrUndefinedExplicit: string | undefined = undefined;
        stringOrUndefinedExplicit.length;

        let stringOrUndefinedImplicit = "" as string | undefined;
        stringOrUndefinedImplicit.length;

        let stringOrNullExplicit: string | null = "" as string | null;
        stringOrNullExplicit.length;

        let stringOrNullImplicit = "" as null | undefined;
        stringOrNullImplicit.length;

        let stringOrNullOrUndefinedExplicit: string | null | undefined = null;
        stringOrNullOrUndefinedExplicit.length;

        let stringOrNullOrUndefinedImplicit = "" as string | null | undefined;
        stringOrNullOrUndefinedImplicit.length;
    }

    class Abc {
        def() {
            this.givenNumber = 1!;
            this.givenNumberOrUndefined = (1 as number | undefined)!;
            this.givenUndefined = undefined!;

            this.givenTwiceSame = 1!;
            this.givenTwiceSame = 1!;

            this.givenTwiceDifferent = 1!;
            this.givenTwiceDifferent = undefined!;
        }
    }
})();
