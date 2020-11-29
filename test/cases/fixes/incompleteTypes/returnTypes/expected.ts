(function () {
    function functionReturnsString(): string {
        return "";
    }

    function functionReturnsUndefined(): string | undefined {
        return undefined;
    }

    function functionReturnsNull(): string | null {
        return null;
    }

    function functionGivenNullReturnsUndefined(): string | null | undefined {
        return undefined;
    }

    function functionGivenUndefinedReturnsNull(): string | undefined | null {
        return null;
    }

    function functionReturnsUndefinedAsExpression(): string | undefined {
        return undefined as undefined;
    }

    function functionReturnsUndefinedBinaryExpression(): string | undefined {
        return true && undefined;
    }

    function functionReturnsUndefinedExpression(): string | undefined {
        return true ? "" : undefined;
    }

    function functionReturnsUndefinedVariable(): string | undefined {
        const text: string | undefined = undefined;

        return text;
    }

    function functionReturnsVoidExpression(): string | undefined {
        return void 0;
    }

    function functionIgnoresInnerMethods(): string {
        (function (): string | undefined {
            return undefined;
        })();

        ((): string | undefined => undefined)();

        return "";
    }

    function functionReturnsNullAsAny(): any | null {
        return null;
    }

    function functionReturnsUndefinedAsAny(): any | undefined {
        return undefined;
    }

    const lambdaReturnsUndefined = (): string | undefined => {
        return undefined;
    };

    const lambdaReturnsNull = (): string | null => {
        return null;
    };

    const lambdaGivenNullReturnsUndefined = (): string | null | undefined => {
        return undefined;
    };

    const lambdaGivenUndefinedReturnsNull = (): string | undefined | null => {
        return null;
    };

    const lambdaIgnoresInnerMethods = (): string => {
        (function (): string | undefined {
            return undefined;
        })();

        ((): string | undefined => undefined)();

        return "";
    };
})();