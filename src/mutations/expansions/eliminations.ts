import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

export const originalTypeHasIncompleteType = (
    request: FileMutationsRequest,
    originalType: ts.Type,
    assignedTypes: ReadonlyArray<ts.Type>,
) => {
    const typeChecker = request.services.program.getTypeChecker();

    return assignedTypes.some((assignedType) => !typeChecker.isTypeAssignableTo(originalType, assignedType));
};
