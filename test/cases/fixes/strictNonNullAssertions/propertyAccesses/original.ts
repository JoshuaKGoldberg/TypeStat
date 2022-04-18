(function () {
    declare const value: string | undefined;

    value.length;
    value?.length;
    
    declare const valueAny: any;

    valueAny.length;
    valueAny?.length;

    declare const valueAnyOrUndefined: any | undefined;

    valueAnyOrUndefined.length;
    valueAnyOrUndefined?.length;
    
    // Internal declarations
    class Abc {
        givenNumber: number;
        givenNumberOrUndefined: number;
        givenUndefined: number;

        givenTwiceSame: number;
        
        givenTwiceDifferent: number;

        givenAlreadyAsserted: number;

        def() {
            this.givenNumber = 1;
            this.givenNumberOrUndefined = 1 as number | undefined;
            this.givenUndefined = undefined;

            this.givenTwiceSame = 1;
            this.givenTwiceSame = 1;

            this.givenTwiceDifferent = 1;
            this.givenTwiceDifferent = undefined;

            this.givenAlreadyAsserted = undefined!;
        }
    }

    // External declarations

    class Container {
        givenUndefined: string = "";

        givenUndefinedHasNull: string | null = "";

        givenNull: string = "";

        givenNullHasUndefined: string | undefined = "";

        givenString: string = "";

        givenStringHasNull: string | null = "";

        givenStringHasUndefined: string | undefined = "";

        setToUndefined: string = undefined;

        setToUndefinedHasNull: string | null = undefined;

        setToNull: string = null;

        setToNullHasUndefined: string | undefined = null;

        setToString: string = "";

        setToStringHasUndefined: string | undefined = "";

        setToStringHasNull: string | null = "";
    }

    const container = new Container();

    container.givenUndefined = undefined;
    container.givenUndefinedHasNull = undefined;
    container.givenNull = null;
    container.givenNullHasUndefined = null;
    container.givenString = "";
    container.givenStringHasNull = "";
    container.givenStringHasNull = "";

    // Nested type shapes

    function withNullableString(value: string | undefined) {
        value.length;
    }

    interface NotNullable {
        a: {
            b: {
                c: number;
            }
        }
    }

    function withNotNullable(value: NotNullable) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withOptionalNotNullable(value?: NotNullable) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withPartialNotNullable(value: Partial<NotNullable>) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withOptionalPartialNotNullable(value?: Partial<NotNullable>) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    interface OuterNullable {
        a?: {
            b: {
                c: number;
            }
        }
    }

    function withOuterNullable(value: OuterNullable) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withOptionalOuterNullable(value?: OuterNullable) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withPartialOuterNullable(value: Partial<OuterNullable>) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withOptionalPartialOuterNullable(value?: Partial<OuterNullable>) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    interface MiddleNullable {
        a: {
            b?: {
                c: number;
            }
        }
    }

    function withMiddleNullable(value: MiddleNullable) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withOptionalMiddleNullable(value?: MiddleNullable) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withPartialMiddleNullable(value: Partial<MiddleNullable>) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withOptionalPartialMiddleNullable(value?: Partial<MiddleNullable>) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    interface InnerNullable {
        a: {
            b: {
                c?: number;
            }
        }
    }

    function withInnerNullable(value: InnerNullable) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withOptionalInnerNullable(value?: InnerNullable) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withPartialInnerNullable(value: Partial<InnerNullable>) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }

    function withOptionalPartialInnerNullable(value?: Partial<InnerNullable>) {
        value.a.b.c.toPrecision(0);
        value.a?.b.c.toPrecision(0);
        value.a?.b?.c.toPrecision(0);
        value.a?.b?.c?.toPrecision(0);
        value.a?.b.c?.toPrecision(0);
        value.a.b.c?.toPrecision(0);
        value.a.b?.c.toPrecision(0);
    }
})();
