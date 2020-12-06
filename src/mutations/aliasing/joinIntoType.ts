import ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { isNotUndefined } from "../../shared/arrays";
import { isIntrisinicNameType, isTypeWithValue } from "../../shared/typeNodes";
import { getTypeAtLocationIfNotError } from "../../shared/types";

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
            // .filter(isTypeNamePrintable)
            .map((type) => printFriendlyNameOfType(request, type))
            .filter(isNotUndefined)
            // If the type is aliased to a () => lambda, it should probably be wrapped in ()
            .map((type) => (type.includes(") =>") ? `(${type})` : type)),
        // At this point we can be sure the type exists in type aliases
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...Array.from(flags).map((type) => typeAliases.get(type)!),
    ]);
};

const intrinsicNameAliases = new Map([
    ["false", "boolean"],
    ["true", "boolean"],
]);

const printFriendlyNameOfType = (request: FileMutationsRequest, type: ts.Type): string => {
    // If this is a declared interface or type alias (type MyType = { ... }), use that MyType name
    // Alternately, also try this as an inline object literal
    const friendlyTypeName = printFriendlyNameOfInterfaceOrTypeAlias(type);
    if (friendlyTypeName !== undefined) {
        return friendlyTypeName;
    }

    const callSignatures = type.getCallSignatures();

    // If the type otherwise isn't a function, we can generally print it directly by name...
    if (callSignatures.length === 0) {
        // ...assuming it does have a name, which isn't true for literals such as 'boolean'
        const symbol = type.getSymbol();
        if (symbol !== undefined && !symbol.name.startsWith("__")) {
            return symbol.name;
        }
    }

    // If there's only exactly one type signature, use the happy () => ... shorthand
    if (callSignatures.length === 1) {
        return printShorthandCallSignature(request, callSignatures[0]);
    }

    // If it's a literal type for a user-facing one such as 'boolean', go with that
    if (isIntrisinicNameType(type)) {
        return intrinsicNameAliases.get(type.intrinsicName) ?? type.intrinsicName;
    }

    // If it's a literal type such as '' or 0, print its literal type name
    if (isTypeWithValue(type)) {
        return typeof type.value;
    }

    // Since this isn't a better-known object, it might be an object literal descriptor (i.e. { ... })
    const objectLiteralDescriptor = printObjectLiteralDescriptor(request, type);
    if (objectLiteralDescriptor !== undefined) {
        return objectLiteralDescriptor;
    }

    // If all else fails, there was no information available, so this is probably just unknown
    return "unknown";
};

const printFriendlyNameOfInterfaceOrTypeAlias = (type: ts.Type) => {
    const declarations = type.getSymbol()?.getDeclarations();
    if (declarations?.length !== 1) {
        return undefined;
    }

    const [declaration] = declarations;
    const { parent } = declaration;

    if (ts.isInterfaceDeclaration(parent) || ts.isTypeAliasDeclaration(parent)) {
        return parent.name.text;
    }

    return undefined;
};

const printObjectLiteralDescriptor = (request: FileMutationsRequest, type: ts.Type) => {
    if (!(type.flags & ts.TypeFlags.Object)) {
        return undefined;
    }

    const properties = type.getProperties();
    if (properties.length === 0) {
        return "{}";
    }

    return [
        "{",
        properties
            .map((property) => {
                const valueType = getTypeAtLocationIfNotError(request, property.valueDeclaration);
                if (valueType === undefined) {
                    return undefined;
                }

                return [property.name, printFriendlyNameOfType(request, valueType)].join(": ");
            })
            .filter(isNotUndefined)
            .join(", "),
        "}",
    ].join(" ");
};

const printShorthandCallSignature = (request: FileMutationsRequest, callSignature: ts.Signature): string => {
    const parameters = callSignature.parameters.map((parameter, index) => printSignatureParameter(request, parameter, index));
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

const printSignatureParameter = (request: FileMutationsRequest, parameter: ts.Symbol, index: number) => {
    const valueDeclaration = parameter.valueDeclaration as ts.ParameterDeclaration;
    const { name } = valueDeclaration;
    const type = getTypeAtLocationIfNotError(request, valueDeclaration);
    if (type === undefined) {
        return undefined;
    }

    const nameText = ts.isIdentifier(name) ? name.text : `arg${index}`;

    return `${nameText}: ${createTypeName(request, type)}`;
};
