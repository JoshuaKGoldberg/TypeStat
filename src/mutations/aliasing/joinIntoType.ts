import ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

import { getApplicableTypeAliases } from "./aliases";
import { createTypeName } from "./createTypeName";
import { findAliasOfTypes } from "./findAliasOfTypes";

/**
 * Joins assigning types into a union to be used as a type reference.
 *
 * @param flags   Flags to include in the type union.
 * @param types   Types to include in the type union.
 * @param request   Source file, metadata, and settings to collect mutations in the file.
 * @param allowStrictNullCheckAliases   Whether to allow `null` and `undefined` aliases regardless of compiler strictness.
 * @returns Joined type union of the aliased flags and types.
 * @remarks Removes any rich types that resolve to anonymous object literals.
 */
export const joinIntoType = (
    flags: ReadonlySet<ts.TypeFlags>,
    types: ReadonlySet<ts.Type>,
    request: FileMutationsRequest,
    allowStrictNullCheckAliases?: boolean,
): string | undefined => {
    // If we don't include rich types, ignore any new type that would add any
    if (request.options.types.onlyPrimitives && types.size !== 0) {
        return undefined;
    }

    // Grab the built-in aliases for types we'll be outputting
    const typeAliases = getApplicableTypeAliases(request, allowStrictNullCheckAliases);

    // Convert types to their aliased names per our type aliases
    return findAliasOfTypes(request, [
        ...Array.from(types)
            .filter(isTypeNamePrintable)
            .map((type) => printFriendlyNameOfType(request, type))
            // If the type is aliased to a () => lambda, it should probably be wrapped in ()
            .map((type) => (type.includes(") =>") ? `(${type})` : type)),
        // At this point we can be sure the type exists in type aliases
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...Array.from(flags).map((type) => typeAliases.get(type)!),
    ]);
};

const printFriendlyNameOfType = (request: FileMutationsRequest, type: ts.Type): string => {
    // If the type isn't a function, we can generally print it directly by name
    // Note that the type given to this function shouldn't be union or intersection types
    const callSignatures = type.getCallSignatures();
    if (callSignatures.length === 0) {
        return type.symbol.name;
    }

    // If there's only one type signature, use the happy () => ... shorthand
    if (callSignatures.length === 1) {
        return printShorthandCallSignature(request, callSignatures[0]);
    }

    // Looks like we'd have to print a { (): ...; (): ...; } multiple call signatures object
    // ...but this is such a rare case in TypeStat usage, that for now, let's just use Function (lol)
    return "Function";
};

const printShorthandCallSignature = (request: FileMutationsRequest, callSignature: ts.Signature): string => {
    const parameters = callSignature.parameters.map((parameter) => printSignatureParameter(request, parameter));
    const returnType = createTypeName(request, callSignature.getReturnType());
    const typeParameters =
        callSignature.typeParameters === undefined || callSignature.typeParameters.length === 0
            ? undefined
            : callSignature.typeParameters.map((typeParameter) => createTypeName(request, typeParameter));

    let text = `(${parameters.join(", ")}) => ${returnType === undefined ? `void` : returnType}`;

    if (typeParameters !== undefined) {
        text = `<${typeParameters.join(", ")}>` + text;
    }

    return text;
};

const printSignatureParameter = (request: FileMutationsRequest, parameter: ts.Symbol) => {
    const valueDeclaration = parameter.valueDeclaration as ts.ParameterDeclaration;
    const { name } = valueDeclaration;
    const type = request.services.program.getTypeChecker().getTypeAtLocation(valueDeclaration);

    return `${name}: ${createTypeName(request, type)}`;
};

const isTypeNamePrintable = (type: ts.Type): boolean => !(type.symbol.flags & ts.SymbolFlags.ObjectLiteral);
