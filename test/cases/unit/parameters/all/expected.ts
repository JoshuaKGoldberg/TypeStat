(function() {
    function givenStringTypeLater(abc): void {
        console.log(abc);
    }

    givenStringTypeLater("");

    function givenStringOrNullTypeLater(abc): void {
        console.log(abc);
    }

    givenStringOrNullTypeLater("" as string | null);

    function givenStringOrNullOnStringTypeLater(abc: string | null /* todo: null */): void {
        console.log(abc);
    }

    givenStringOrNullOnStringTypeLater("" as string | null);

    function givenStringOrUndefinedOnStringTypeLater(abc: string | undefined): void {
        console.log(abc);
    }

    givenStringOrUndefinedOnStringTypeLater("" as string | undefined);

    function givenNullTypeLater(abc): void {
        console.log(abc);
    }

    givenNullTypeLater(null);

    function givenUndefinedTypeLater(abc): void {
        console.log(abc);
    }

    givenUndefinedTypeLater(undefined);

    function givenAnyTypeLater(abc): void {
        console.log(abc);
    }

    givenAnyTypeLater({} as any);

    function givenEmptyObjectLiteralTypeLater(abc): void {
        console.log(abc);
    }

    givenEmptyObjectLiteralTypeLater({});

    function givenObjectTypeLater(abc: Object): void {
        console.log(abc);
    }

    givenObjectTypeLater({} as Object);
})();
