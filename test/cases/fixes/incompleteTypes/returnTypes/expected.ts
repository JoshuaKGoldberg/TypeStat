(function () {
    function functionReturnsString(): string {
        return "";
    }

    function functionReturnsUndefined(): string | TODO_1_0 {
        return undefined;
    }

    function functionReturnsNull(): string | TODO_1_0 {
        return null;
    }

    function functionGivenNullReturnsUndefined(): string | null | TODO_1_0 {
        return undefined;
    }

    function functionGivenUndefinedReturnsNull(): string | undefined | TODO_1_0 {
        return null;
    }

    function functionReturnsUndefinedAsExpression(): string | TODO_1_0 {
        return undefined as undefined;
    }

    function functionReturnsUndefinedBinaryExpression(): string | TODO_1_0 {
        return true && undefined;
    }

    function functionReturnsUndefinedExpression(): string | TODO_1_0 {
        return true ? "" : undefined;
    }

    function functionReturnsUndefinedVariable(): string | TODO_1_0 {
        const text: string | undefined = undefined;

        return text;
    }

    function functionReturnsVoidExpression(): string | TODO_1_0 {
        return void 0;
    }

    function functionIgnoresInnerMethods(): string {
        (function (): string | undefined {
            return undefined;
        })();

        ((): string | undefined => undefined)();

        return "";
    }

    function functionReturnsNullAsAny(): any | TODO_1_0 {
        return null;
    }

    function functionReturnsUndefinedAsAny(): any | TODO_1_0 {
        return undefined;
    }

    const lambdaReturnsUndefined = (): string | TODO_1_0 => {
        return undefined;
    };

    const lambdaReturnsNull = (): string | TODO_1_0 => {
        return null;
    };

    const lambdaGivenNullReturnsUndefined = (): string | null | TODO_1_0 => {
        return undefined;
    };

    const lambdaGivenUndefinedReturnsNull = (): string | undefined | TODO_1_0 => {
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