import * as tsutils from "tsutils";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../shared/fileMutator";
import { isKnownGlobalBaseType, isNeverAndOrUnknownType } from "../../shared/nodeTypes";

const onlyTypes = (candidateTypes: ReadonlyArray<ts.Type | string>): candidateTypes is ReadonlyArray<ts.Type> =>
    !candidateTypes.some((candidateType) => typeof candidateType === "string");

/**
 * @returns Whether any of the extra types don't yet exist on an original type.
 * @remarks If any of the candidate types are strings, this unfortunately has to assume true.
 */
export const originalTypeHasIncompleteType = (
    request: FileMutationsRequest,
    originalType: ts.Type,
    candidateTypes: ReadonlyArray<ts.Type | string>,
) => {
    if (!onlyTypes(candidateTypes)) {
        return true;
    }

    // If the original type is something like Function and at least one candidate type isn't,
    // consider the Function to be reporting not enough info (like a base type)
    if (isKnownGlobalBaseType(originalType) && !candidateTypes.every(isKnownGlobalBaseType)) {
        return true;
    }

    // If the original type is unknown or never, we can always assume it's missing info
    if (isNeverAndOrUnknownType(originalType)) {
        return true;
    }

    return candidateTypes.some((assignedType) => !candidateTypeIsAssignableToOriginal(request, assignedType, originalType));
};

const candidateTypeIsAssignableToOriginal = (request: FileMutationsRequest, candidateType: ts.Type, originalType: ts.Type) => {
    const typeChecker = request.services.program.getTypeChecker();

    // The type checker things that functions with similar base return types are the same
    // e.g. () => boolean is marked as assignable to () => void
    // We know that's false, so if the two are functions
    const missingFunctionReturn = functionReturnIsIncomplete(request, candidateType, originalType);
    if (missingFunctionReturn !== undefined) {
        return !missingFunctionReturn;
    }

    // Otherwise we can directly use isTypeAssignableTo checking
    return typeChecker.isTypeAssignableTo(candidateType, originalType);
};

const functionReturnIsIncomplete = (request: FileMutationsRequest, candidateType: ts.Type, originalType: ts.Type) => {
    const typeChecker = request.services.program.getTypeChecker();

    // Skip this logic if neither of the types are actually functions that return void
    if (!anySignatureReturnsVoid(candidateType) && !anySignatureReturnsVoid(originalType)) {
        return undefined;
    }

    // Regardless of the original compiler options, factor in covariance checks to be super duper sure
    return !typeChecker.isTypeAssignableTo(candidateType, originalType) || !typeChecker.isTypeAssignableTo(originalType, candidateType);
};

function anySignatureReturnsVoid(type: ts.Type) {
    return type.getCallSignatures().some((callSignature) => tsutils.isTypeFlagSet(callSignature.getReturnType(), ts.TypeFlags.Void));
}
