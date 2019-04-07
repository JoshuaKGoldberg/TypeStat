(function() {
    // Direct calls

    function oneParameterStringDirect(abc: string) {}
    oneParameterStringDirect("");

    function oneParameterStringBecomesNullDirect(abc: string | null /* todo: null */) {}
    oneParameterStringBecomesNullDirect(null);

    function oneParameterStringBecomesNullOrUndefinedDirect(abc: string | null /* todo: null */) {}
    oneParameterStringBecomesNullOrUndefinedDirect(null);

    function oneParameterStringBecomesUndefinedDirect(abc: string | undefined) {}
    oneParameterStringBecomesUndefinedDirect(undefined);

    function twoParametersStringDirect(abc: string, def: string) {}
    twoParametersStringDirect("", "");

    function twoParametersStringBecomesNullDirect(abc: string | null /* todo: null */, def: string | null /* todo: null */) {}
    twoParametersStringBecomesNullDirect(null, null);

    function twoParametersStringBecomesNullOrUndefinedDirect(abc: string | null /* todo: null */, def: string | undefined) {}
    twoParametersStringBecomesNullOrUndefinedDirect(null, undefined);

    function twoParametersStringBecomesUndefinedDirect(abc: string | undefined, def: string | undefined) {}
    twoParametersStringBecomesUndefinedDirect(undefined, undefined);

    function takesString(abc: string | null /* todo: null */ | undefined) {}
    takesString(null);
    takesString(undefined);
    takesString(null as null | undefined);
    takesString(undefined as null | undefined);
    takesString("" as string | null);
    takesString("" as string | undefined);
    takesString("" as string | null | undefined);

    let emptyExplicitSibling: undefined = undefined;
    let emptyImplicitSibling = undefined;
    let emptyExplicitChild: undefined = undefined;
    let emptyImplicitChild = undefined;
    let textSibling: string | undefined = "";
    let textChild: string | undefined = "";

    takesString(emptyExplicitSibling);
    takesString(emptyImplicitSibling);
    takesString(textSibling);

    function innerCalling() {
        takesString(emptyExplicitChild);
        takesString(emptyImplicitChild);
        takesString(textChild);
    }

    // Function results

    function createsStringOrNull(): string | null {
        return null;
    }

    const createsStringOrUndefined = (): string | undefined => undefined;

    function oneParameterStringBecomesNullIndirect(abc: string | null /* todo: null */) {}
    oneParameterStringBecomesNullIndirect(createsStringOrNull());

    const oneParameterStringBecomesUndefinedIndirect = (abc: string) => {};
    oneParameterStringBecomesUndefinedIndirect(createsStringOrUndefined());
})();
