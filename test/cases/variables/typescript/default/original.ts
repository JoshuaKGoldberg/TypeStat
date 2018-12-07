// Primitives

let givenUndefined = "";
givenUndefined = undefined

let givenUndefinedAsString: string = "";
givenUndefinedAsString = undefined;

let givenUndefinedHasNull: string | null = "";
givenUndefinedHasNull = undefined;

let givenNull = "";
givenNull = null;

let givenNullAsString: string = "";
givenNullAsString = null;

let givenNullHasUndefined: string | undefined = "";
givenNullHasUndefined = null;

let givenString;
givenString = "";

let givenStringAsString: string = "";
givenStringAsString = "";

let givenStringHasNull: string | null = "";
givenStringHasNull = "";

let givenStringHasUndefined: string | undefined = "";
givenStringHasNull = "";

let setToUndefined: string = undefined;

let setToUndefinedHasNull: string | null = undefined;

let setToNull: string = null;

let setToNullAsNull = null;

let setToNullHasUndefined: string | undefined = null;

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
let onlyClassOneExplicitInterface: SampleInterface = new SampleClassOne();

let eitherClassImplicit = new SampleClassOne();
eitherClassImplicit = new SampleClassTwo();

let eitherClassExplicit: SampleInterface = new SampleClassOne();
eitherClassExplicit = new SampleClassTwo();

let eitherClassNeedsUnionImplicit = new SampleClassOne();
eitherClassNeedsUnionImplicit = new SampleClassTwo();

let eitherClassNeedsUnionExplicit: SampleClassOne = new SampleClassOne();
eitherClassNeedsUnionExplicit = new SampleClassTwo();

let eitherClassNeedsUnionExplicitInterface: SampleInterface = new SampleClassOne();
eitherClassNeedsUnionExplicit = new SampleClassTwo();

let eitherClassNeedsNullImplicit = new SampleClassOne();
eitherClassNeedsNullImplicit = new SampleClassTwo();
eitherClassNeedsNullImplicit = null;

let eitherClassNeedsNullAndClassExplicit: SampleClassOne | null = new SampleClassOne();
eitherClassNeedsNullAndClassExplicit = new SampleClassTwo();
eitherClassNeedsNullImplicit = null;

let eitherClassNeedsUndefinedExplicit: SampleClassOne = new SampleClassOne();
eitherClassNeedsUndefinedExplicit = new SampleClassTwo();
eitherClassNeedsUndefinedExplicit = undefined;

let eitherClassNeedsUndefinedExplicitInterface: SampleInterface = new SampleClassOne();
eitherClassNeedsUndefinedExplicit = new SampleClassTwo();
eitherClassNeedsUndefinedExplicit = undefined;

let eitherClassNeedsUndefinedAndClassExplicit: SampleClassOne | undefined = new SampleClassOne();
eitherClassNeedsUndefinedAndClassExplicit = new SampleClassTwo();
eitherClassNeedsUndefinedAndClassExplicit = undefined;
