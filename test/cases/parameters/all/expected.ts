function givenStringTypeLater(abc: string): void {
    console.log(abc);
}

givenStringTypeLater("");

function givenStringOrNullTypeLater(abc: string | null): void {
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

function givenNullTypeLater(abc: undefined): void {
    console.log(abc);
}

givenNullTypeLater(undefined);

function givenUndefinedTypeLater(abc: null): void {
    console.log(abc);
}

givenUndefinedTypeLater(null);
