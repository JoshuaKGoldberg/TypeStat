import * as ts from "typescript";
import { TypeStatOptions, TypeStatTypeOptions } from "../options/types";

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

export const getApplicableTypeAliases = (options: TypeStatOptions) =>
    options.fixes.strictNullChecks
        ? strictTypeFlagsWithAliases
        : nonStrictTypeFlagAliases;

/**
 * Joins assigning types into a union to be used as a type reference.
 * 
 * @param flags   Flags to include in the type union.
 * @param types   Types to include in the type union.
 * @param typeOptions   Options for which types to add under what aliases.
 * @returns Joined type union of the aliased flags and types.
 * @remarks Removes any rich types that resolve to anonymous object literals.
 */
export const joinIntoType = (
    flags: ReadonlySet<string>,
    types: ReadonlySet<ts.Type>,
    typeOptions: TypeStatTypeOptions,
): string | undefined => {
    // If we don't include rich types, ignore any new type that would add any
    if (typeOptions.onlyPrimitives && types.size !== 0) {
        return undefined;
    }

    const unionNames = [
        ...Array.from(types)
            .filter(isTypeNamePrintable)
            .map(type => type.symbol.name),
        ...flags,
    ];

    if (unionNames.length === 0) {
        return undefined;
    }

    return unionNames
        .map(type => {
            const alias = typeOptions.aliases.get(type);

            return alias === undefined
                ? type
                : alias;
        })
        .join(" | ");
};

const isTypeNamePrintable = (type: ts.Type): boolean => !(type.symbol.flags & ts.SymbolFlags.ObjectLiteral);
