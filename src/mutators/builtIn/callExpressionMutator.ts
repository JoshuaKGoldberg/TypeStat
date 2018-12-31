import { combineMutations, IMultipleMutations, IMutation } from "automutate";
import * as tsutils from "tsutils";
import * as ts from "typescript";

import { isTypeFlagSetRecursively } from "../../mutations/collecting/flags";
import { createNonNullAssertionInsertion } from "../../mutations/typeMutating/nonNullAssertion";
import { getValueDeclarationOfType } from "../../shared/nodeTypes";
import { collectMutationsFromNodes } from "../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../fileMutator";

export const callExpressionMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    // This fixer is only relevant if adding non-null assertions is enabled
    if (!request.options.fixes.strictNonNullAssertions) {
        return [];
    }

    return collectMutationsFromNodes(request, isVisitableCallExpression, visitCallExpression);
};

const isVisitableCallExpression = (node: ts.Node): node is ts.CallExpression =>
    ts.isCallExpression(node) &&
    // We can quickly ignore any calls without arguments
    node.arguments.length !== 0;

const visitCallExpression = (node: ts.CallExpression, request: FileMutationsRequest): IMultipleMutations | undefined => {
    const valueDeclaration = getValueDeclarationOfType(request, node.expression);
    if (valueDeclaration === undefined || !tsutils.isFunctionWithBody(valueDeclaration)) {
        return undefined;
    }

    const argumentMutations = collectArgumentMutations(request, node, valueDeclaration);

    if (argumentMutations.length === 0) {
        return undefined;
    }

    return combineMutations(...argumentMutations);
};

const collectArgumentMutations = (
    request: FileMutationsRequest,
    node: ts.CallExpression,
    valueDeclaration: ts.FunctionLikeDeclaration,
): ReadonlyArray<IMutation> => {
    const mutations: IMutation[] = [];
    const visitableArguments = Math.min(node.arguments.length, valueDeclaration.parameters.length);
    const typeChecker = request.services.program.getTypeChecker();

    for (let i = 0; i < visitableArguments; i += 1) {
        const typeOfArgument = typeChecker.getTypeAtLocation(node.arguments[i]);
        const typeOfParameter = typeChecker.getTypeAtLocation(valueDeclaration.parameters[i]);

        if (
            isTypeMissingBetween(ts.TypeFlags.Null, typeOfArgument, typeOfParameter) ||
            isTypeMissingBetween(ts.TypeFlags.Undefined, typeOfArgument, typeOfParameter)
        ) {
            mutations.push(createNonNullAssertionInsertion(request.sourceFile, node.arguments[i]));
        }
    }

    return mutations;
};

const isTypeMissingBetween = (typeFlag: ts.TypeFlags, typeOfArgument: ts.Type, typeOfParameter: ts.Type): boolean =>
    isTypeFlagSetRecursively(typeOfArgument, typeFlag) && !isTypeFlagSetRecursively(typeOfParameter, typeFlag);
