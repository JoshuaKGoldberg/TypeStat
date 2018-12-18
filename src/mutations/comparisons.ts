import * as tsutils from "tsutils";
import * as ts from "typescript";

import { FileMutationsRequest } from "../mutators/fileMutator";

export const typeIsChildOf = (
    request: FileMutationsRequest,
    child: ts.Type,
    potentialParent: ts.Type,
): boolean => {
    // `any` is always a parent of everything
    if (potentialParent.flags & ts.TypeFlags.Any) {
        return true;
    }

    if (areTypesRoughlyEqual(request, child, potentialParent)) {
        return true;
    }

    if (!tsutils.isInterfaceType(child) || !tsutils.isInterfaceType(potentialParent)) {
        return false;
    }

    if (child.getSymbol() !== undefined && child.getSymbol() === potentialParent.getSymbol()) {
        return true;
    }

    const typeChecker = request.services.program.getTypeChecker();
    const childBaseTypes = typeChecker.getBaseTypes(child);

    for (const baseType of childBaseTypes) {
        if (tsutils.isInterfaceType(baseType)) {
            if (typeIsChildOf(request, baseType, potentialParent)) {
                return true;
            }
        }

        if (tsutils.isUnionType(baseType)) {
            for (const type of baseType.types) {
                if (typeIsChildOf(request, type, potentialParent)) {
                    return true;
                }
            }
        }
    }

    return false;
};

/**
 * Checks whether two types seem to be roughly the same.
 * 
 * @remarks
 * This is a rough equivalent of the equivalent internal TypeScript APIs
 * They actually check whether types are assignable; this just checks whether they're 'equal'
 */
export const areTypesRoughlyEqual = (request: FileMutationsRequest, a: ts.Type, b: ts.Type) => {
    if (a === b) {
        return;
    }

    // If the basic object flags differ, these cannot be the same type
    if (a.flags !== b.flags) {
        return false;
    }

    // If either is missing a symbol, use that to tell if they're apparently not the same
    const symbolA = a.getSymbol();
    const symbolB = b.getSymbol();
    if (symbolA === undefined || symbolB === undefined) {
        return symbolA === symbolB;
    }

    // If either has call signatures, treat them like functions
    const callSignaturesA = a.getCallSignatures();
    const callSignaturesB = b.getCallSignatures();
    if (
        (callSignaturesA !== undefined && callSignaturesA.length !== 0)
        || (callSignaturesB !== undefined && callSignaturesB.length !== 0)
    ) {
        // If one has call signatures but the other doesn't, they can't be the same.
        if (callSignaturesA === undefined || callSignaturesB === undefined) {
            return false;
        }

        return areAllCallSignaturesRoughlyEqual(request, callSignaturesA, callSignaturesB);
    }

    // Now that the symbols are known to exist, check if they're different by name
    if (a.symbol.name !== b.symbol.name) {
        return false;
    }

    // If the types are arrays, they can only be different if they have differing type arguments
    // Eventually this will need to be expanded to other types, such as Sets or custom <T>-capable types
    if (a.symbol.name === "Array") {
        return areTypeArgumentsRoughlyEqual(request, a, b);
    }

    return true;
};

const areAllCallSignaturesRoughlyEqual = (request: FileMutationsRequest, callSignaturesA: ReadonlyArray<ts.Signature>, callSignaturesB: ReadonlyArray<ts.Signature>) => {
    if (callSignaturesA.length !== callSignaturesB.length) {
        return false;
    }

    for (let i = 0; i < callSignaturesA.length; i += 1) {
        if (!areCallSignaturesRoughlyEqual(request, callSignaturesA[i], callSignaturesB[i])) {
            return false;
        }
    }

    return true;
};

const areCallSignaturesRoughlyEqual = (request: FileMutationsRequest, callSignatureA: ts.Signature, callSignatureB: ts.Signature) => {
    if (callSignatureA.parameters.length !== callSignatureB.parameters.length) {
        return false;
    }

    for (let i = 0; i < callSignatureA.parameters.length; i += 1) {
        if (!areTypesRoughlyEqual(
            request,
            request.services.program.getTypeChecker().getDeclaredTypeOfSymbol(callSignatureA.parameters[i]),
            request.services.program.getTypeChecker().getDeclaredTypeOfSymbol(callSignatureB.parameters[i])
        )) {
            return false;
        }
    }

    if (callSignatureA.getReturnType() !== callSignatureB.getReturnType()) {
        return false;
    }

    return true;
};

const areTypeArgumentsRoughlyEqual = (request: FileMutationsRequest, a: ts.Type, b: ts.Type) => {
    // If either is missing <T> types arguments, assume they're the same
    if (!typeHasTypeArguments(a) || !typeHasTypeArguments(b)) {
        return true;
    }

    // If different numbers of type arguments exist, they're not the same
    if (a.typeArguments.length !== b.typeArguments.length) {
        return false;
    }

    // If any type argument differs, they can't be the same type
    for (let i = 0; i < a.typeArguments.length; i += 1) {
        if (!areTypesRoughlyEqual(request, a.typeArguments[i], b.typeArguments[i])) {
            return false;
        }
    }

    return true;
};

type TypeWithTypeArguments = ts.Type & { typeArguments: ReadonlyArray<ts.Type> };

const typeHasTypeArguments = (type: ts.Type): type is TypeWithTypeArguments =>
    "typeArguments" in type && (type as TypeWithTypeArguments).typeArguments instanceof Array;
