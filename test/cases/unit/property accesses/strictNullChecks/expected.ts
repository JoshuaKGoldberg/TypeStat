{
    let useForString: string = "";
    let useForStringOrNull: string | null = null;
    let useForStringOrUndefined: string | undefined = undefined;
    let useForStringOrNullOrUndefined: string | null | undefined = null;

    let stringExplicit: string = "";
    stringExplicit.length;

    let stringImplicit = "";
    stringImplicit.length;

    let stringOrUndefinedExplicit: string | undefined = "";
    stringOrUndefinedExplicit!.length;

    let stringOrUndefinedImplicit = "" as string | undefined;
    stringOrUndefinedImplicit!.length;

    let stringOrNullExplicit: string | null = "" as string | null;
    stringOrNullExplicit!.length;

    let stringOrNullImplicit = "" as null | undefined;
    stringOrNullImplicit!.length;

    let stringOrNullOrUndefinedExplicit: string | null | undefined = "";
    stringOrNullOrUndefinedExplicit!.length;

    let stringOrNullOrUndefinedImplicit = "" as string | null | undefined;
    stringOrNullOrUndefinedImplicit!.length;
}
