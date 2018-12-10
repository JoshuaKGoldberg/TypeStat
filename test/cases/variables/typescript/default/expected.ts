// Primitives

let givenUndefined: string | undefined = "";
givenUndefined = undefined

let givenUndefinedAsString: string | undefined = "";
givenUndefinedAsString = undefined;

let givenUndefinedHasNull: string | null | undefined = "";
givenUndefinedHasNull = undefined;

let givenNull: string | null = "";
givenNull = null;

let givenNullAsString: string | null = "";
givenNullAsString = null;

let givenNullHasUndefined: string | undefined | null = "";
givenNullHasUndefined = null;

let givenString: string;
givenString = "";

let givenStringAsString: string = "";
givenStringAsString = "";

let givenStringHasNull: string | null = "";
givenStringHasNull = "";

let givenStringHasUndefined: string | undefined = "";
givenStringHasNull = "";

let setToUndefined: string | undefined = undefined;

let setToUndefinedHasNull: string | null | undefined = undefined;

let setToNull: string | null = null;

let setToNullAsNull: null = null;

let setToNullHasUndefined: string | undefined | null = null;

let setToString = "";

let setToStringAsString: string = "";

let setToStringHasUndefined: string | undefined = "";

let setToStringHasNull: string | null = "";

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
    readonly required = 1;
}

let onlyInterfaceImplicit = { required: 1 };
let onlyInterfaceExplicit: SampleInterface = { required: 1 };

let onlyClassOneImplicit = new SampleClassOne();
let onlyClassOneExplicitClass: SampleClassOne = new SampleClassOne();
let onlyClassOneExplicitInterface: SampleInterface | SampleClassOne = new SampleClassOne();

let eitherClassImplicit: SampleClassOne | SampleClassTwo = new SampleClassOne();
eitherClassImplicit = new SampleClassTwo();

let eitherClassExplicit: SampleInterface | SampleClassOne | SampleClassTwo = new SampleClassOne();
eitherClassExplicit = new SampleClassTwo();

let eitherClassNeedsUnionImplicit: SampleClassOne | SampleClassTwo = new SampleClassOne();
eitherClassNeedsUnionImplicit = new SampleClassTwo();

let eitherClassNeedsUnionExplicit: SampleClassOne | SampleClassTwo = new SampleClassOne();
eitherClassNeedsUnionExplicit = new SampleClassTwo();

let eitherClassNeedsUnionExplicitInterface: SampleInterface | SampleClassOne = new SampleClassOne();
eitherClassNeedsUnionExplicit = new SampleClassTwo();

let eitherClassNeedsNullImplicit: SampleClassOne | SampleClassTwo | null = new SampleClassOne();
eitherClassNeedsNullImplicit = new SampleClassTwo();
eitherClassNeedsNullImplicit = null;

let eitherClassNeedsNullAndClassExplicit: SampleClassOne | null | SampleClassTwo = new SampleClassOne();
eitherClassNeedsNullAndClassExplicit = new SampleClassTwo();
eitherClassNeedsNullImplicit = null;

let eitherClassNeedsUndefinedExplicit: SampleClassOne | SampleClassTwo | undefined = new SampleClassOne();
eitherClassNeedsUndefinedExplicit = new SampleClassTwo();
eitherClassNeedsUndefinedExplicit = undefined;

let eitherClassNeedsUndefinedExplicitInterface: SampleInterface | SampleClassOne = new SampleClassOne();
eitherClassNeedsUndefinedExplicit = new SampleClassTwo();
eitherClassNeedsUndefinedExplicit = undefined;

let eitherClassNeedsUndefinedAndClassExplicit: SampleClassOne | undefined | SampleClassTwo = new SampleClassOne();
eitherClassNeedsUndefinedAndClassExplicit = new SampleClassTwo();
eitherClassNeedsUndefinedAndClassExplicit = undefined;
