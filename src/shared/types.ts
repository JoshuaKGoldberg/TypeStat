import * as tsutils from "tsutils";
import * as ts from "typescript";

export enum CollectedType {
    Unknown = -1,
    None = 0,
    Null = 1,
    Undefined = 2,
}

export type StrictType = CollectedType.None | CollectedType.Null | CollectedType.Undefined | 3;

export const collectStrictTypesFromTypeNode = (type: ts.TypeNode | ts.UnionTypeNode | undefined): CollectedType => {
    if (type === undefined || ts.isIntersectionTypeNode(type)) {
        return CollectedType.Unknown;
    }

    let result = CollectedType.None;

    const types = ts.isUnionTypeNode(type) ? type.types : [type];

    for (const subType of types) {
        if (subType.kind === ts.SyntaxKind.NullKeyword) {
            result |= CollectedType.Null;
        } else if (subType.kind === ts.SyntaxKind.UndefinedKeyword) {
            result |= CollectedType.Undefined;
        }
    }

    return result;
};

/**
 * Adds any new strict types to a declared type from a node's types.
 *
 * @param declaredType   Strict types declared in the type.
 * @param missingTypes   Already-found types missing from the declared type.
 * @param assigningType   New assigned type to check for missing types.
 * @returns Union of the already-found missing types and any new ones.
 */
export const addMissingAssigningNodeType = (
    declaredType: CollectedType,
    missingTypes: CollectedType,
    assigningType: ts.Type,
): CollectedType => {
    // If the type is ever assigned something of an any or unknown type there's nothing we can do
    if (tsutils.isTypeFlagSet(assigningType, ts.TypeFlags.Any) || tsutils.isTypeFlagSet(assigningType, ts.TypeFlags.Unknown)) {
        return CollectedType.Unknown;
    }

    // If not already null but assigned a type including it, null is missing
    if (!(declaredType & CollectedType.Null) && tsutils.isTypeFlagSet(assigningType, ts.TypeFlags.Null)) {
        missingTypes |= CollectedType.Null;
    }

    // If not already undefined but assigned a type including it, undefined is missing
    if (!(declaredType & CollectedType.Undefined) && tsutils.isTypeFlagSet(assigningType, ts.TypeFlags.Undefined)) {
        missingTypes |= CollectedType.Undefined;
    }

    return missingTypes;
};

/**
 * Adds any new strict types to a declared type from a node's types.
 *
 * @param declaredType   Strict types declared in the type.
 * @param missingTypes   Already-found types missing from the declared type.
 * @param assigningType   New assigned type to check for missing types.
 * @returns Union of the already-found missing types and any new ones.
 */
export const addMissingCollectedType = (
    declaredType: CollectedType,
    missingTypes: CollectedType,
    assigningType: CollectedType,
): CollectedType => {
    // If the type is ever assigned something of an unknown type there's nothing we can do
    if (assigningType & CollectedType.Unknown) {
        return CollectedType.Unknown;
    }

    // If not already null but assigned a type including it, null is missing
    if (!(declaredType & CollectedType.Null) && assigningType & CollectedType.Null) {
        missingTypes |= CollectedType.Null;
    }

    // If not already undefined but assigned a type including it, undefined is missing
    if (!(declaredType & CollectedType.Undefined) && assigningType & CollectedType.Undefined) {
        missingTypes |= CollectedType.Undefined;
    }

    return missingTypes;
};
