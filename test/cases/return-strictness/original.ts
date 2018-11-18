function functionReturnsUndefined(): string {
    return undefined;
}

function functionReturnsNull(): string {
    return null;
}

function functionGivenNullReturnsUndefined(): string | null {
    return undefined;
}

function functionGivenUndefinedReturnsNull(): string | undefined {
    return null;
}

function functionIgnoresInnerMethods(): string {
    (function(): string | undefined {
        return undefined;
    })();

    ((): string | undefined => undefined)();

    return "";
}

const lambdaReturnsUndefined = (): string => {
    return undefined;
};

const lambdaReturnsNull = (): string => {
    return null;
};

const lambdaGivenNullReturnsUndefined = (): string | null => {
    return undefined;
};

const lambdaGivenUndefinedReturnsNull = (): string | undefined => {
    return null;
};

const lambdaIgnoresInnerMethods = (): string => {
    (function(): string | undefined {
        return undefined;
    })();

    ((): string | undefined => undefined)();

    return "";
};
