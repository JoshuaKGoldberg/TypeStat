import * as tsutils from "tsutils";
import * as ts from "typescript";

import { setSubtract } from "../../shared/sets";

const knownTypeFlagEquivalents = new Map([
    [ts.TypeFlags.BigInt, ts.TypeFlags.BigIntLiteral],
    [ts.TypeFlags.BigIntLiteral, ts.TypeFlags.BigInt],
    [ts.TypeFlags.Number, ts.TypeFlags.NumberLiteral],
    [ts.TypeFlags.NumberLiteral, ts.TypeFlags.Number],
    [ts.TypeFlags.String, ts.TypeFlags.StringLiteral],
    [ts.TypeFlags.StringLiteral, ts.TypeFlags.String],
    [ts.TypeFlags.Undefined, ts.TypeFlags.Void],
    [ts.TypeFlags.Void, ts.TypeFlags.Undefined],
]);

export const findMissingFlags = (
    declaredType: ts.Type,
    assignedFlags: ReadonlySet<ts.TypeFlags>,
    declaredFlags: ReadonlySet<ts.TypeFlags>,
) => {
    // TODO: collectFlagsAndTypesFromTypes should have worked recursively to make these exhaustive. Double-check that?
    //     For example: why is string | undefined | string still coming up?

    // If the type is declared to allow `any`, it can't be missing anything
    if (isTypeFlagSetRecursively(declaredType, ts.TypeFlags.Any)) {
        return new Set();
    }

    // Otherwise, it's all the flags assigned to it that weren't already declared
    const missingFlags = setSubtract(assignedFlags, declaredFlags);

    // Remove any flags that are just equivalents of the existing ones
    // For example, initial presense of `void` makes `undefined` unnecessary, and vice versa
    for (const [original, equivalent] of knownTypeFlagEquivalents) {
        if (missingFlags.has(equivalent) && isTypeFlagSetRecursively(declaredType, original)) {
            missingFlags.delete(equivalent);
        }
    }

    return missingFlags;
};

/**
 * Checks if a type contains a type flag, accounting for deep nested type unions.
 * 
 * @param parentType   Parent type to check for the type flag.
 * @param typeFlag   Type flag to check within the parent type.
 * @returns Whether the parent type contains the type flag.
 */
export const isTypeFlagSetRecursively = (parentType: ts.Type, typeFlag: ts.TypeFlags): boolean => {
    if (tsutils.isTypeFlagSet(parentType, typeFlag)) {
        return true;
    }

    if (tsutils.isUnionOrIntersectionType(parentType)) {
        for (const childType of parentType.types) {
            if (isTypeFlagSetRecursively(childType, typeFlag)) {
                return true;
            }
        }
    }

    return false;
};
