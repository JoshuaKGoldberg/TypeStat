import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";

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
    const typeChecker = request.services.program.getTypeChecker();
    const extensionSymbol = typeChecker.getTypeAtLocation(extension).getSymbol();
    if (extensionSymbol === undefined) {
        return undefined;
    }

    const { valueDeclaration } = extensionSymbol;
    if (!ts.isClassLike(valueDeclaration)) {
        return undefined;
    }

    return valueDeclaration;
};
