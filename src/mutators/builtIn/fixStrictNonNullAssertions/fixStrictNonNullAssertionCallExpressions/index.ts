import { combineMutations, IMultipleMutations, IMutation } from "automutate";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { createNonNullAssertion } from "../../../../mutations/typeMutating/createNonNullAssertion";
import { getParentOfKind, getVariableInitializerForExpression } from "../../../../shared/nodes";
import { getValueDeclarationOfType, isTypeMissingBetween } from "../../../../shared/nodeTypes";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

export const fixStrictNonNullAssertionCallExpressions: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    return collectMutationsFromNodes(request, isVisitableCallExpression, visitCallExpression);
};

const isVisitableCallExpression = (node: ts.Node): node is ts.CallExpression =>
    ts.isCallExpression(node) &&
    // We can quickly ignore any calls without arguments
    node.arguments.length !== 0;

const visitCallExpression = (node: ts.CallExpression, request: FileMutationsRequest): IMultipleMutations | undefined => {
    // Collect the declared type of the function-like being called
    const functionLikeValueDeclaration = getValueDeclarationOfType(request, node.expression);
    if (functionLikeValueDeclaration === undefined || !tsutils.isFunctionWithBody(functionLikeValueDeclaration)) {
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
    functionLikeValueDeclaration: ts.FunctionLikeDeclaration,
): ReadonlyArray<IMutation> => {
    const mutations: IMutation[] = [];
    const visitableArguments = Math.min(callingNode.arguments.length, functionLikeValueDeclaration.parameters.length);
    const typeChecker = request.services.program.getTypeChecker();

    // Check the types of each argument being passed in against the declared parameter type
    for (let i = 0; i < visitableArguments; i += 1) {
        const typeOfArgument = typeChecker.getTypeAtLocation(callingNode.arguments[i]);
        const typeOfParameter = typeChecker.getTypeAtLocation(functionLikeValueDeclaration.parameters[i]);

        // If either null or undefined is missing in the argument, we'll need a ! mutation
        if (
            isTypeMissingBetween(ts.TypeFlags.Null, typeOfArgument, typeOfParameter) ||
            isTypeMissingBetween(ts.TypeFlags.Undefined, typeOfArgument, typeOfParameter)
        ) {
            mutations.push(collectArgumentMutation(request, callingNode.arguments[i]));
        }
    }

    return mutations;
};

const collectArgumentMutation = (request: FileMutationsRequest, callingArgument: ts.Expression) => {
    // If the argument is a variable declared in the parent function, add the ! to the variable
    if (ts.isIdentifier(callingArgument)) {
        const declaringVariableInitializer = getVariableInitializerForExpression(
            request,
            callingArgument,
            getParentOfKind(callingArgument, isFunctionBodyOrBlock),
        );
        if (declaringVariableInitializer !== undefined) {
            return createNonNullAssertion(request, declaringVariableInitializer);
        }
    }

    // Otherwise add the ! at the calling site's argument
    return createNonNullAssertion(request, callingArgument);
};

const isFunctionBodyOrBlock = (node: ts.Node): node is ts.Block | ts.FunctionLikeDeclaration | ts.SourceFile =>
    tsutils.isFunctionWithBody(node) || ts.isBlock(node) || ts.isSourceFile(node);
