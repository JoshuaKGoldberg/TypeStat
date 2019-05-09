import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";

import { collectFlagsAndTypesFromTypes } from "./collecting";

/**
 * Type flags and aliases to check when --strictNullChecks is not enabled.
 */
const nonStrictTypeFlagAliases = new Map([
    [ts.TypeFlags.Boolean, "boolean"],
    [ts.TypeFlags.BooleanLiteral, "boolean"],
    [ts.TypeFlags.Number, "number"],
    [ts.TypeFlags.NumberLiteral, "number"],
    [ts.TypeFlags.String, "string"],
    [ts.TypeFlags.StringLiteral, "string"],
]);

/**
 * Type flags and aliases to check when --strictNullChecks is enabled.
 */
const strictTypeFlagsWithAliases = new Map([
    ...nonStrictTypeFlagAliases,
    [ts.TypeFlags.Null, "null"],
    [ts.TypeFlags.Undefined, "undefined"],
]);

/**
 * @returns Built-in type flags and aliases per overall request strictNullChecks setting.
 */
export const getApplicableTypeAliases = (request: FileMutationsRequest, alwaysAllowStrictNullCheckAliases: boolean = false) =>
    alwaysAllowStrictNullCheckAliases ||
    request.options.types.strictNullChecks ||
    request.services.program.getCompilerOptions().strictNullChecks
        ? strictTypeFlagsWithAliases
        : nonStrictTypeFlagAliases;

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
    let unionNames = [
        ...Array.from(types)
            .filter(isTypeNamePrintable)
            .map((type) => printFriendlyNameOfType(request, type))
            // If the type is aliased to a () => lambda, it should probably be wrapped in ()
            .map((type) => (type.includes(") =>") ? `(${type})` : type)),
        // tslint:disable-next-line:no-non-null-assertion
        ...Array.from(flags).map((type) => typeAliases.get(type)!),
    ];

    // If we exclude unmatched types, remove those
    if (request.options.types.matching !== undefined) {
        unionNames = filterMatchingTypeNames(unionNames, request.options.types.matching);
    }

    if (unionNames.length === 0) {
        return undefined;
    }

    // Remove any duplicate names, since seemingly different flags or types might resolve to the same
    unionNames = [...new Set(unionNames)];

    // Alias the unioned names into what they'll be printed as
    // We intentionally don't remove duplicates here, as some aliases might be "TODO" or similar
    unionNames = unionNames.map((type) => findAliasOfType(type, request.options.types.aliases));

    return unionNames.join(" | ");
};

const isTypeNamePrintable = (type: ts.Type): boolean => !(type.symbol.flags & ts.SymbolFlags.ObjectLiteral);

const filterMatchingTypeNames = (unionNames: ReadonlyArray<string>, matching: ReadonlyArray<string>): string[] =>
    unionNames.filter((name) => matching.some((matcher) => name.match(matcher) !== null));

/**
 * Given a type name, returns its matched alias if one is found, or the type otherwise.
 *
 * @remarks
 * It's likely this could become a performance concern for projects with many type aliases.
 * If (and only if) profiling shows this to be the case, consider adding a cache to the request object.
 */
export const findAliasOfType = (type: string, aliases: ReadonlyMap<RegExp, string>): string => {
    for (const [matcher, value] of aliases) {
        if (type.match(matcher) !== null) {
            return value.replace(/\{0\}/g, type);
        }
    }

    return type;
};

/**
 * Creates a printable type name summarizing existing type(s).
 */
export const createTypeName = (request: FileMutationsRequest, ...types: ts.Type[]) => {
    // In non-strict mode, `null` and `undefined` are aliased to "".
    // If nothing is found then we know types is just an array of null and/or undefined
    for (const allowStrictNullCheckAliases of [false, true]) {
        // Find the flags and nested types from the declared type
        const [typeFlags, allTypes] = collectFlagsAndTypesFromTypes(request, types, allowStrictNullCheckAliases);

        // Join the missing types into a type string
        // Most of the time, flags and/or type names will be found on the types
        const joinedType = joinIntoType(typeFlags, allTypes, request, allowStrictNullCheckAliases);
        if (joinedType !== undefined) {
            return joinedType;
        }
    }

    return undefined;
};

export const printFriendlyNameOfType = (request: FileMutationsRequest, type: ts.Type): string => {
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
