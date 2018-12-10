function givenStringTypeLater(abc): void {
    console.log(abc);
}

givenStringTypeLater("");

function givenStringOrNullTypeLater(abc): void {
    console.log(abc);
}

givenStringOrNullTypeLater("" as string | null);

function givenStringOrUndefinedTypeLater(abc): void {
    console.log(abc);
}

givenStringOrUndefinedTypeLater("" as string | undefined);

function givenNullTypeLater(abc): void {
    console.log(abc);
}

givenNullTypeLater(undefined);

function givenUndefinedTypeLater(abc): void {
    console.log(abc);
}

givenUndefinedTypeLater(null);
