function givenStringTypeLater(abc: string): void {
    console.log(abc);
}

givenStringTypeLater("");

function givenStringOrNullTypeLater(abc: string): void {
    console.log(abc);
}

givenStringOrNullTypeLater("" as string | null);

function givenStringOrNullOnStringTypeLater(abc: string): void {
    console.log(abc);
}

givenStringOrNullOnStringTypeLater("" as string | null);

function givenStringOrUndefinedOnStringTypeLater(abc: string): void {
    console.log(abc);
}

givenStringOrUndefinedOnStringTypeLater("" as string | undefined);

function givenNullTypeLater(abc: any): void {
    console.log(abc);
}

givenNullTypeLater(undefined);

function givenUndefinedTypeLater(abc: any): void {
    console.log(abc);
}

givenUndefinedTypeLater(null);
