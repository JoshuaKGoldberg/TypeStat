import { isUnionType } from "tsutils";
import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { ExposedTypeChecker } from "../mutations/createExposedTypeScript";
import { isIntrisinicNameType, isOptionalTypeArgumentsTypeNode } from "./typeNodes";
import { getTypeAtLocationIfNotError } from "./types";

export const declaredInitializedTypeNodeIsRedundant = (request: FileMutationsRequest, declaration: ts.TypeNode, initializer: ts.Node) => {
    // Most literals (e.g. `""`) have a corresponding keyword (e.g. `string`)
    switch (declaration.kind) {
        case ts.SyntaxKind.BooleanKeyword:
            return initializer.kind === ts.SyntaxKind.FalseKeyword || initializer.kind === ts.SyntaxKind.TrueKeyword;

        case ts.SyntaxKind.NullKeyword:
            return initializer.kind === ts.SyntaxKind.NullKeyword;

        case ts.SyntaxKind.NumberKeyword:
            return initializer.kind === ts.SyntaxKind.NumericLiteral;

        case ts.SyntaxKind.StringKeyword:
            return initializer.kind === ts.SyntaxKind.StringLiteral;

        // (except for `undefined`, which is an initializer one should never reassign)
        case ts.SyntaxKind.UndefinedKeyword:
            return ts.isIdentifier(initializer) && initializer.text === "undefined";
    }

    // `RegExp`s are also initializers that one should never reassign
    if (ts.isTypeReferenceNode(declaration) && ts.isIdentifier(declaration.typeName)) {
        switch (declaration.typeName.text) {
            case "RegExp":
                return initializer.kind === ts.SyntaxKind.RegularExpressionLiteral;
        }
    }

    // Other types are complex enough to need the type checker...
    const declaredType = getTypeAtLocationIfNotError(request, declaration);
    if (declaredType === undefined) {
        return undefined;
    }

    const initializedType = getTypeAtLocationIfNotError(request, initializer);
    if (initializedType === undefined) {
        return undefined;
    }

    return declaredTypeIsEquivalent(request.services.program.getTypeChecker(), declaredType, initializedType);
};

const declaredTypeIsEquivalent = (typeChecker: ExposedTypeChecker, declaredType: ts.Type, initializedType: ts.Type) => {
    // Most types, such as `string[]` / `[""]`, are generally found by this intersection...
    if (
        typeChecker.isTypeAssignableTo(declaredType, initializedType) &&
        typeChecker.isTypeAssignableTo(initializedType, declaredType) &&
        // ...though, notably, declares union types trigger false positives against non-union initializations
        !(isUnionType(declaredType) && !isUnionType(initializedType))
    ) {
        return true;
    }

    // We have to hackily check for boolean types with intrinsic names...
    // `boolean[]` is really the type `[false, true]`
    if (isIntrisinicNameType(declaredType) && isIntrisinicNameType(initializedType)) {
        return intrinsicNamesAreEquivalent(declaredType.intrinsicName, initializedType.intrinsicName);
    }

    // If the types have the same symbol, they're likely arrays or classes with potentially comparable generics
    return typeSymbolsAndArgumentsAreEquivalent(typeChecker, declaredType, initializedType);
};

const typeSymbolsAndArgumentsAreEquivalent = (typeChecker: ExposedTypeChecker, declaredType: ts.Type, initializedType: ts.Type) => {
    const declaredSymbol = declaredType.getSymbol();
    const initializedSymbol = initializedType.getSymbol();
    if (
        declaredSymbol !== initializedSymbol ||
        !isOptionalTypeArgumentsTypeNode(declaredType) ||
        declaredType.typeArguments === undefined ||
        !isOptionalTypeArgumentsTypeNode(initializedType) ||
        initializedType.typeArguments === undefined
    ) {
        return false;
    }

    if (declaredType.typeArguments.length !== initializedType.typeArguments.length) {
        return false;
    }

    for (let i = 0; i < declaredType.typeArguments.length; i += 1) {
        const declaredTypeArgument = declaredType.typeArguments[i];
        const initializedTypeArgument = initializedType.typeArguments[i];

        if (!declaredTypeIsEquivalent(typeChecker, declaredTypeArgument, initializedTypeArgument)) {
            return false;
        }
    }

    return true;
};

/**
 * Checks intrinsic names of types that wouldn't have been caught with `typeChecker.isTypeAssignableTo`.
 */
const intrinsicNamesAreEquivalent = (declaredName: string, initializedName: string) => {
    switch (declaredName) {
        case "boolean":
            return initializedName === "false" || initializedName === "true";

        case "null":
            return initializedName === "null";
    }

    return false;
};
