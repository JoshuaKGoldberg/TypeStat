import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { isKnownGlobalBaseType } from "../../shared/nodeTypes";

/**
 * @returns Whether any of the extra types don't yet exist on an original type.
 */
export const originalTypeHasIncompleteType = (
    request: FileMutationsRequest,
    originalType: ts.Type,
    candidateTypes: ReadonlyArray<ts.Type>,
) => {
    const typeChecker = request.services.program.getTypeChecker();

    // If the original type is something like Function and at least one candidate type isn't,
    // consider the Function to be reporting not enough info (like a base type)
    if (isKnownGlobalBaseType(originalType) && !candidateTypes.every(isKnownGlobalBaseType)) {
        return true;
    }

    // Otherwise we can directly use isTypeAssignableTo checking
    return candidateTypes.some((assignedType) => !typeChecker.isTypeAssignableTo(assignedType, originalType));
};
