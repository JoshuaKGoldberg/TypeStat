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
