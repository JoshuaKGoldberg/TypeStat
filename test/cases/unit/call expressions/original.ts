{
    // Direct calls

    function oneParameterStringDirect(abc: string) {}
    oneParameterStringDirect("");

    function oneParameterStringBecomesNullDirect(abc: string) {}
    oneParameterStringBecomesNullDirect(null);

    function oneParameterStringBecomesNullOrUndefinedDirect(abc: string) {}
    oneParameterStringBecomesNullOrUndefinedDirect(null);

    function oneParameterStringBecomesUndefinedDirect(abc: string) {}
    oneParameterStringBecomesUndefinedDirect(undefined);

    function twoParametersStringDirect(abc: string, def: string) {}
    twoParametersStringDirect("", "");

    function twoParametersStringBecomesNullDirect(abc: string, def: string) {}
    twoParametersStringBecomesNullDirect(null, null);

    function twoParametersStringBecomesNullOrUndefinedDirect(abc: string, def: string) {}
    twoParametersStringBecomesNullOrUndefinedDirect(null, undefined);

    function twoParametersStringBecomesUndefinedDirect(abc: string, def: string) {}
    twoParametersStringBecomesUndefinedDirect(undefined, undefined);

    // Function results

    function createsStringOrNull(): string | null {
        return null;
    }

    const createsStringOrUndefined = (): string | undefined => undefined;

    function oneParameterStringBecomesNullIndirect(abc: string) {}
    oneParameterStringBecomesNullIndirect(createsStringOrNull());

    const oneParameterStringBecomesUndefinedIndirect = (abc: string) => {};
    oneParameterStringBecomesUndefinedIndirect(createsStringOrUndefined());
}
