import * as React from 'react';

(function () {
    // Primitives

    let givenUndefined = "";
    givenUndefined = undefined;

    let givenUndefinedAsString: string | TODO_1_0 = "";
    givenUndefinedAsString = undefined;

    let givenUndefinedHasNull: string | null | TODO_1_0 = "";
    givenUndefinedHasNull = undefined;

    let givenNullAndUndefinedHasNull: string | null | TODO_1_0 = "";
    givenNullAndUndefinedHasNull = null;
    givenNullAndUndefinedHasNull = undefined;

    let givenNull = "";
    givenNull = null;

    let givenNullAsString: string | TODO_1_0 = "";
    givenNullAsString = null;

    let givenNullHasUndefined: string | undefined | TODO_1_0 = "";
    givenNullHasUndefined = null;

    let givenNullAndUndefinedHasUndefined: string | undefined | TODO_1_0 = "";
    givenNullAndUndefinedHasUndefined = null;
    givenNullHasUndefined = undefined;

    let givenString;
    givenString = "";

    let givenStringAsString: string = "";
    givenStringAsString = "";

    let givenStringHasNull: string | null = "";
    givenStringHasNull = "";

    let givenStringHasUndefined: string | undefined = "";
    givenStringHasNull = "";

    let setToUndefined: string | TODO_1_0 = undefined;

    let setToUndefinedHasNull: string | null | TODO_1_0 = undefined;

    let setToNull: string | TODO_1_0 = null;

    let setToNullAsNull = null;

    let setToNullHasUndefined: string | undefined | TODO_1_0 = null;

    let setToString = "";

    let setToStringAsString: string = "";

    let setToStringHasUndefined: string | undefined = "";

    let setToStringHasNull: string | null = "";

    // Any

    let startsAnyWithString: any | TODO_1_0 = "";

    let startsAnyGivenString: any | TODO_1_0;
    startsAnyGivenString = "";

    let startsAnyWithStringGivenString: any | TODO_1_0 = "";
    startsAnyWithStringGivenString = "";

    let startsStringWithAny: string = {} as any;

    let startsStringGivenAny: string;
    startsStringGivenAny = {} as any;

    // Async

    async function _() {
        let stringFromNullImmediate: string = await Promise.resolve<null>(null);

        let stringFromUndefinedLater: string;
        stringFromUndefinedLater = await Promise.resolve<undefined>(undefined);
    }

    // Interfaces and classes

    interface SampleInterface {
        readonly optional?: boolean;
        readonly required: number;
    }

    class SampleClassOne implements SampleInterface {
        readonly required = 1;
    }

    class SampleClassTwo implements SampleInterface {
        readonly optional = false;
        readonly required = 2;
    }

    let onlyInterfaceImplicit = { required: 1 };
    let onlyInterfaceExplicit: SampleInterface = { required: 1 };

    let onlyClassOneImplicit = new SampleClassOne();
    let onlyClassOneExplicitClass: SampleClassOne = new SampleClassOne();
    let onlyClassOneExplicitInterface: SampleInterface = new SampleClassOne();

    let eitherClassImplicit = new SampleClassOne();
    eitherClassImplicit = new SampleClassTwo();

    let eitherClassExplicit: SampleInterface = new SampleClassOne();
    eitherClassExplicit = new SampleClassTwo();

    let eitherClassNeedsUnionImplicit = new SampleClassOne();
    eitherClassNeedsUnionImplicit = new SampleClassTwo();

    let eitherClassNeedsUnionExplicit: SampleClassOne | TODO_0_1 = new SampleClassOne();
    eitherClassNeedsUnionExplicit = new SampleClassTwo();

    let eitherClassNeedsUnionExplicitInterface: SampleInterface = new SampleClassOne();
    eitherClassNeedsUnionExplicitInterface = new SampleClassTwo();

    let eitherClassNeedsNullImplicit = new SampleClassOne();
    eitherClassNeedsNullImplicit = new SampleClassTwo();
    eitherClassNeedsNullImplicit = null;

    let eitherClassNeedsNullAndClassExplicit: SampleClassOne | null | TODO_0_1 = new SampleClassOne();
    eitherClassNeedsNullAndClassExplicit = new SampleClassTwo();
    eitherClassNeedsNullAndClassExplicit = null;

    let eitherClassNeedsUndefinedExplicit: SampleClassOne | TODO_1_1 = new SampleClassOne();
    eitherClassNeedsUndefinedExplicit = new SampleClassTwo();
    eitherClassNeedsUndefinedExplicit = undefined;

    let eitherClassNeedsUndefinedExplicitInterface: SampleInterface | TODO_1_0 = new SampleClassOne();
    eitherClassNeedsUndefinedExplicitInterface = new SampleClassTwo();
    eitherClassNeedsUndefinedExplicitInterface = undefined;

    let eitherClassNeedsUndefinedAndClassExplicit: SampleClassOne | undefined | TODO_0_1 = new SampleClassOne();
    eitherClassNeedsUndefinedAndClassExplicit = new SampleClassTwo();
    eitherClassNeedsUndefinedAndClassExplicit = undefined;

    // Array setting
    let numberImplicit = [1];
    numberImplicit = [1];

    let numberExplicitPrimitive: number[] = [1];
    numberExplicitPrimitive = [1];

    let numberExplicitTemplated: Array<number> = [1];
    numberExplicitTemplated = [1] as Array<number>;

    // Array Iteration

    const iterableStrings = ["abc", "def", "ghi"];
    for (const string of iterableStrings) {
    }

    const iterableStringOrUndefineds: (string | undefined)[] = ["abc", "def", "ghi"];
    for (const stringOrUndefined of iterableStringOrUndefineds) {
    }

    // Object iteration

    const containsStrings = { a: "a", b: "b" };
    for (const key in containsStrings) {
    }

    const containsStringOrUndefineds: { [i: string]: string | undefined } = {};
    for (const key in containsStringOrUndefineds) {
    }

    // Functions

    let returnsString: TODO_0_1;
    returnsString = () => "";

    let returnsStringOrNumber: TODO_0_2;
    returnsStringOrNumber = () => "";
    returnsStringOrNumber = () => 0;

    // Predeclared functions (React FCs)
    
    interface MyComponentProps {
        text: string;
    }

    const MyComponent: React.FC<MyComponentProps> = ({
        text 
    }) => {
        return <span>{text}</span>;
    }
})();