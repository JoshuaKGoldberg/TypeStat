import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";
import { getTypeAtLocationIfNotError } from "./types";

export const getClassExtendsExpression = (node: ts.ClassLikeDeclaration): ts.ExpressionWithTypeArguments | undefined => {
    const { heritageClauses } = node;
    if (heritageClauses === undefined) {
        return undefined;
    }

    const classExtension = heritageClauses.find((clause) => clause.token === ts.SyntaxKind.ExtendsKeyword);
    if (classExtension === undefined) {
        return undefined;
    }

    return classExtension.types.length === 1 ? classExtension.types[0] : undefined;
};

export const getBaseClassDeclaration = (
    request: FileMutationsRequest,
    extension: ts.ExpressionWithTypeArguments,
): ts.ClassLikeDeclaration | undefined => {
    // First try retrieving the base class from the extension itself
    let extensionSymbol = getTypeAtLocationIfNotError(request, extension)?.getSymbol();

    // If that didn't work, it might be from a type error due to missing type parameters
    // Try the base constructor of the child class instead
    // This is an internal member, but ah well...
    if (extensionSymbol === undefined) {
        const { resolvedBaseConstructorType } = getTypeAtLocationIfNotError(request, extension.parent.parent) as any;

        if (resolvedBaseConstructorType !== undefined) {
            extensionSymbol = resolvedBaseConstructorType.symbol;
        }
    }

    if (extensionSymbol === undefined) {
        return undefined;
    }

    const { valueDeclaration } = extensionSymbol;
    if (!valueDeclaration || !ts.isClassLike(valueDeclaration)) {
        return undefined;
    }

    return valueDeclaration;
};
