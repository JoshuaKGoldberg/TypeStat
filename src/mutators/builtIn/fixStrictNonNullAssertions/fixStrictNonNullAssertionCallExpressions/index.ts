import { combineMutations, MultipleMutations, Mutation } from "automutate";
import * as ts from "typescript";
import { isTypeFlagSetRecursively } from "../../../../mutations/collecting/flags";

import { createNonNullAssertion } from "../../../../mutations/typeMutating/createNonNullAssertion";
import { getValueDeclarationOfFunction } from "../../../../shared/functionTypes";
import { getParentOfKind, getVariableInitializerForExpression } from "../../../../shared/nodes";
import { isNullOrUndefinedMissingBetween } from "../../../../shared/nodeTypes";
import { getTypeAtLocationIfNotError } from "../../../../shared/types";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../../shared/fileMutator";

export const fixStrictNonNullAssertionCallExpressions: FileMutator = (request: FileMutationsRequest): ReadonlyArray<Mutation> => {
    return collectMutationsFromNodes(request, isVisitableCallExpression, visitCallExpression);
};

const isVisitableCallExpression = (node: ts.Node): node is ts.CallExpression =>
    ts.isCallExpression(node) &&
    // We can quickly ignore any calls without arguments
    node.arguments.length !== 0;

const visitCallExpression = (node: ts.CallExpression, request: FileMutationsRequest): MultipleMutations | undefined => {
    // Collect the declared type of the function-like being called
    const functionLikeValueDeclaration = getValueDeclarationOfFunction(request, node.expression);
    if (functionLikeValueDeclaration === undefined) {
        return undefined;
    }
    // Collect mutations for each argument as needed
    const argumentMutations = collectArgumentMutations(request, node, functionLikeValueDeclaration);
    if (argumentMutations.length === 0) {
        return undefined;
    }

    return combineMutations(...argumentMutations);
};

const collectArgumentMutations = (
    request: FileMutationsRequest,
    callingNode: ts.CallExpression,
    functionLikeValueDeclaration: ts.SignatureDeclaration,
): ReadonlyArray<Mutation> => {
    const mutations: Mutation[] = [];
    const visitableArguments = Math.min(callingNode.arguments.length, functionLikeValueDeclaration.parameters.length);

    // Check the types of each argument being passed in against the declared parameter type
    for (let i = 0; i < visitableArguments; i += 1) {
        // We can ignore parameters that are 'any'
        const typeOfParameter = getTypeAtLocationIfNotError(request, functionLikeValueDeclaration.parameters[i]);
        if (typeOfParameter === undefined || isTypeFlagSetRecursively(typeOfParameter, ts.TypeFlags.Any)) {
            continue;
        }

        const typeOfArgument = getTypeAtLocationIfNotError(request, callingNode.arguments[i]);

        // If either null or undefined is missing in the argument, we'll need a ! mutation
        if (typeOfArgument !== undefined && isNullOrUndefinedMissingBetween(typeOfArgument, typeOfParameter)) {
            const argumentMutation = collectArgumentMutation(request, callingNode.arguments[i]);
            if (argumentMutation !== undefined) {
                mutations.push(argumentMutation);
            }
        }
    }

    return mutations;
};

const collectArgumentMutation = (request: FileMutationsRequest, callingArgument: ts.Expression) => {
    // If the argument is a variable declared in the parent function, add the ! to the variable...
    if (ts.isIdentifier(callingArgument)) {
        const declaringVariableInitializer = getVariableInitializerForExpression(
            request,
            callingArgument,
            getParentOfKind(callingArgument, isFunctionBodyOrBlock),
        );
        if (declaringVariableInitializer !== undefined) {
            // ...if the variable doesn't already have a ! after its initial value
            return declaringVariableInitializer.kind === ts.SyntaxKind.NonNullExpression
                ? undefined
                : createNonNullAssertion(request, declaringVariableInitializer);
        }
    }

    // Otherwise add the ! at the calling site's argument
    return createNonNullAssertion(request, callingArgument);
};

const isFunctionBodyOrBlock = (node: ts.Node): node is ts.Block | ts.FunctionLikeDeclaration | ts.SourceFile =>
    ts.isFunctionLike(node) || ts.isBlock(node) || ts.isSourceFile(node);
