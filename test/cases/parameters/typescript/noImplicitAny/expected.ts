function givenStringTypeLater(abc: string): void {
    console.log(abc);
}

givenStringTypeLater("");

function givenStringOrNullTypeLater(abc: string): void {
    console.log(abc);
}

givenStringOrNullTypeLater("" as string | null);

function givenStringOrUndefinedTypeLater(abc: string): void {
    console.log(abc);
}

givenStringOrUndefinedTypeLater("" as string | undefined);

function givenNullTypeLater(abc: any): void {
    console.log(abc);
}

givenNullTypeLater(undefined);

function givenUndefinedTypeLater(abc: any): void {
    console.log(abc);
}

givenUndefinedTypeLater(null);
