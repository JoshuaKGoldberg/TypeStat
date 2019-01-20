import { IMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { createCodeFixCreationMutation } from "./creation";
import { processCodeFixActions } from "./processCodeFixActions";

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

export const getNoImplicitAnyMutations = (node: NoImplictAnyNodeToBeFixed, request: FileMutationsRequest): IMutation | undefined => {
    // If we fix for --noImplicitAny compiler complaints, try to get a fix for it and mutate using it
    if (request.options.fixes.noImplicitAny) {
        const codeFixes = getNoImplicitAnyCodeFixes(node, request);

        if (codeFixes.length !== 0) {
            return createCodeFixCreationMutation(codeFixes, {
                ignoreKnownBlankTypes: true,
            });
        }
    }

    // We don't bother making our own --noImplicitAny fixes, since TypeScript is guaranteed to do it better
    return undefined;
};

/**
 * Uses a requesting language service to get --noImplicitAny code fixes for a type of node.
 */
const getNoImplicitAnyCodeFixes = (node: NoImplicitAnyNode, request: FileMutationsRequest) =>
    processCodeFixActions(
        request,
        request.services.languageService.getCodeFixesAtPosition(
            request.sourceFile.fileName,
            node.getStart(request.sourceFile),
            node.end,
            [ts.isParameter(node) ? NoImplicitAnyErrorCode.Parameter : NoImplicitAnyErrorCode.PropertyOrVariable],
            {
                insertSpaceBeforeAndAfterBinaryOperators: true,
            },
            {},
        ),
    );
