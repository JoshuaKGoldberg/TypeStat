import { combineMutations, IMutation } from "automutate";
import * as ts from "typescript";

import { isTypeFlagSetRecursively } from "../../../mutations/collecting/flags";
import { createNonNullAssertion } from "../../../mutations/typeMutating/createNonNullAssertion";
import { getVariableInitializerForExpression } from "../../../shared/nodes";
import { FunctionLikeDeclarationWithType } from "../../../shared/nodeTypes";
import { FileMutationsRequest } from "../../fileMutator";
import { collectReturningNodeExpressions } from "./collectReturningNodeExpressions";

export const fixMissingNonNullReturns = (request: FileMutationsRequest, node: FunctionLikeDeclarationWithType) => {
    // Collect the type initially declared as returned and whether it contains null and/or undefined
    const declaredType = request.services.program.getTypeChecker().getTypeAtLocation(node.type);

    // If the node's explicit return type contains 'any', we can't infer anything
    if (isTypeFlagSetRecursively(declaredType, ts.TypeFlags.Any)) {
        return undefined;
    }

    // If the type already has both null or undefined, rejoice! All is well
    const returningNull = isTypeFlagSetRecursively(declaredType, ts.TypeFlags.Null);
    const returningUndefined = isTypeFlagSetRecursively(declaredType, ts.TypeFlags.Undefined);
    if (returningNull && returningUndefined) {
        return undefined;
    }

    // From now on, we only care about the two types of strict values that could be returned
    const missingReturnTypes = (returningNull ? 0 : ts.TypeFlags.Null) | (returningUndefined ? 0 : ts.TypeFlags.Undefined);

    // Collect ! additions for the return types of nodes in the function
    const returningNodeExpressions = collectReturningNodeExpressions(node);
    const mutations = collectNonNullMutations(request, node, missingReturnTypes, returningNodeExpressions);

    return mutations.length === 0 ? undefined : combineMutations(...mutations);
};

const collectNonNullMutations = (
    request: FileMutationsRequest,
    functionLike: FunctionLikeDeclarationWithType,
    missingReturnTypes: ts.TypeFlags,
    expressions: ReadonlyArray<ts.Expression>,
): ReadonlyArray<IMutation> => {
    const mutations: IMutation[] = [];

    for (const expression of expressions) {
        // If the expression doesn't return a type missing from the return, it's already safe
        const expressionType = request.services.program.getTypeChecker().getTypeAtLocation(expression);
        if (!isTypeFlagSetRecursively(expressionType, missingReturnTypes)) {
            continue;
        }

        // If the expression is an variable declared in the parent function, add the ! to the variable
        if (ts.isIdentifier(expression)) {
            const declaringVariableInitializer = getVariableInitializerForExpression(request, expression, functionLike);
            if (declaringVariableInitializer !== undefined) {
                mutations.push(createNonNullAssertion(request, declaringVariableInitializer));
                continue;
            }
        }

        // Otherwise, add it at the end of the expression
        mutations.push(createNonNullAssertion(request, expression));
    }

    return mutations;
};
