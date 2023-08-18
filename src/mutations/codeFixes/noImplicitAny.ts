import { Mutation } from "automutate";
import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../shared/fileMutator";
import { getTypeAtLocationIfNotError } from "../../shared/types";

import { createCodeFixCreationMutation } from "./creation";
import { getCodeFixIfMatchedByDiagnostic } from "./getCodeFixIfMatchedByDiagnostic";

export type NoImplicitAnyNode = ts.ParameterDeclaration | ts.PropertyDeclaration | ts.VariableDeclaration;

export type NoImplictAnyNodeToBeFixed = NoImplicitAnyNode & {
    initializer: undefined;
    type: undefined;
};

/**
 * Error codes for the TypeScript language service to get --noImplicitAny code fixes.
 */
enum NoImplicitAnyErrorCode {
    Parameter = 7006,
    PropertyOrVariable = 7005,
}

export const canNodeBeFixedForNoImplicitAny = (node: NoImplicitAnyNode): node is NoImplictAnyNodeToBeFixed =>
    node.type === undefined &&
    node.initializer === undefined &&
    // TypeScript still provides --noImplicitAny fixes for variables that can't receive them
    // @see https://github.com/JoshuaKGoldberg/TypeStat/issues/77
    !ts.isCatchClause(node.parent) &&
    // TypeScript provides all parameters' --noImplicitAny fixes when asked for any parameter, so only request on the first
    (!ts.isParameter(node) || node === node.parent.parameters[0]);

export const getNoImplicitAnyMutations = (node: NoImplictAnyNodeToBeFixed, request: FileMutationsRequest): Mutation | undefined => {
    // If the node is a parameter, make sure it doesn't already have an inferable type
    // (TypeScript will still suggest a codefix to make a redundant inferred type)
    if (ts.isParameter(node)) {
        const nodeType = getTypeAtLocationIfNotError(request, node);
        if (nodeType === undefined || !tsutils.isTypeFlagSet(nodeType, ts.TypeFlags.Any)) {
            return undefined;
        }
    }

    // Retrieve code fix suggestions for --noImplicitAny from the requesting language service
    const codeFixes = getCodeFixIfMatchedByDiagnostic(request, node, [
        ts.isParameter(node) ? NoImplicitAnyErrorCode.Parameter : NoImplicitAnyErrorCode.PropertyOrVariable,
    ]);
    if (!codeFixes?.length) {
        return undefined;
    }

    // Convert those code fix suggestions to our own mutations format
    return createCodeFixCreationMutation(request, codeFixes, {
        ignoreKnownBlankTypes: true,
    });
};
