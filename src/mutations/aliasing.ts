import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";

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
export const getApplicableTypeAliases = (request: FileMutationsRequest) =>
    request.options.types.strictNullChecks || request.services.program.getCompilerOptions().strictNullChecks
        ? strictTypeFlagsWithAliases
        : nonStrictTypeFlagAliases;

/**
 * Joins assigning types into a union to be used as a type reference.
 *
 * @param flags   Flags to include in the type union.
 * @param types   Types to include in the type union.
 * @param request   Source file, metadata, and settings to collect mutations in the file.
 * @returns Joined type union of the aliased flags and types.
 * @remarks Removes any rich types that resolve to anonymous object literals.
 */
export const joinIntoType = (
    flags: ReadonlySet<ts.TypeFlags>,
    types: ReadonlySet<ts.Type>,
    request: FileMutationsRequest,
): string | undefined => {
    // If we don't include rich types, ignore any new type that would add any
    if (request.options.types.onlyPrimitives && types.size !== 0) {
        return undefined;
    }

    // Grab the built-in aliases for types we'll be outputting
    const typeAliases = getApplicableTypeAliases(request);

    // Convert types to their aliased names per our type aliases
    let unionNames = [
        ...Array.from(types)
            .filter(isTypeNamePrintable)
            .map((type) => type.symbol.name),
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

    return unionNames.map((type) => findAliasOfType(type, request.options.types.aliases)).join(" | ");
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
