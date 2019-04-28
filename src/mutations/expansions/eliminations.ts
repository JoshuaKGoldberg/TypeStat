import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

/**
 * @returns Whether any of the extra types don't yet exist on an original type.
 */
export const originalTypeHasIncompleteType = (
    request: FileMutationsRequest,
    originalType: ts.Type,
    candidateTypes: ReadonlyArray<ts.Type>,
) => {
    const typeChecker = request.services.program.getTypeChecker();

    return candidateTypes.some((assignedType) => !typeChecker.isTypeAssignableTo(assignedType, originalType));
};
