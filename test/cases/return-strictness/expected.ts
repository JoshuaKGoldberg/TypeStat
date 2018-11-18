function functionReturnsUndefined(): string | undefined /* return-strictness */ {
    return undefined;
}

function functionReturnsNull(): string | null /* return-strictness */ {
    return null;
}

function functionGivenNullReturnsUndefined(): string | null | undefined /* return-strictness */ {
    return undefined;
}

function functionGivenUndefinedReturnsNull(): string | undefined | null /* return-strictness */ {
    return null;
}

function functionIgnoresInnerMethods(): string {
    (function(): string | undefined {
        return undefined;
    })();

    ((): string | undefined => undefined)();

    return "";
}

const lambdaReturnsUndefined = (): string | undefined /* return-strictness */ => {
    return undefined;
};

const lambdaReturnsNull = (): string | null /* return-strictness */ => {
    return null;
};

const lambdaGivenNullReturnsUndefined = (): string | null | undefined /* return-strictness */ => {
    return undefined;
};

const lambdaGivenUndefinedReturnsNull = (): string | undefined | null /* return-strictness */ => {
    return null;
};

const lambdaIgnoresInnerMethods = (): string => {
    (function(): string | undefined {
        return undefined;
    })();

    ((): string | undefined => undefined)();

    return "";
};
