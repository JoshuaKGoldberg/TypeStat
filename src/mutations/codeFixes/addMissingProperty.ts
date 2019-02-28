import { IMutation } from "automutate";
import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

import { createCodeFixCreationMutation } from "./creation";
import { processCodeFixActions } from "./processCodeFixActions";

/**
 * Error code for the TypeScript language service to add a missing property.
 */
const fixMissingPropertyErrorCode = 2339;

export const getMissingPropertyMutations = (request: FileMutationsRequest, node: ts.PropertyAccessExpression): IMutation | undefined => {
    // If we fix for missing properties and this is a "this" access, try to get a fix for it and mutate using it
    if (request.options.fixes.missingProperties && nodeIsSettingThisMember(node)) {
        const codeFixes = getMissingPropertyCodeFixes(node, request);

        if (codeFixes.length !== 0) {
            return createCodeFixCreationMutation(codeFixes);
        }
    }

    // We don't bother making our own missing property fixes, since TypeScript is guaranteed to do it better
    return undefined;
};

/**
 * @returns Whether a property access is setting a 'this' member.
 */
const nodeIsSettingThisMember = (node: ts.PropertyAccessExpression): boolean =>
    ts.isBinaryExpression(node.parent) &&
    node.parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
    node.expression.kind === ts.SyntaxKind.ThisKeyword;

/**
 * Uses a requesting language service to get missing property code fixes for a type of node.
 */
const getMissingPropertyCodeFixes = (node: ts.PropertyAccessExpression, request: FileMutationsRequest) =>
    processCodeFixActions(
        request,
        request.services.languageService.getCodeFixesAtPosition(
            request.sourceFile.fileName,
            node.name.getStart(request.sourceFile),
            node.end,
            [fixMissingPropertyErrorCode],
            {
                insertSpaceBeforeAndAfterBinaryOperators: true,
            },
            {},
        ),
    );
