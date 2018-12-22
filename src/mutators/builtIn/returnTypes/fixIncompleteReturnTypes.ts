import { createTypeAdditionMutation } from "../../../mutations/creators";
import { FunctionLikeDeclarationWithType } from "../../../shared/nodeTypes";
import { FileMutationsRequest } from "../../fileMutator";
import { collectReturningNodeExpressions } from "./collectReturningNodeExpressions";

export const fixIncompleteReturnTypes = (request: FileMutationsRequest, node: FunctionLikeDeclarationWithType) => {
    // Collect the type initially declared as returned
    const declaredType = request.services.program.getTypeChecker().getTypeAtLocation(node.type);

    // Collect types of nodes returned by the function
    const returnedTypes = collectReturningNodeExpressions(node)
        .map(request.services.program.getTypeChecker().getTypeAtLocation);

    // Add later-returned types to the node's type declaration if necessary
    return createTypeAdditionMutation(request, node, declaredType, returnedTypes);
};
