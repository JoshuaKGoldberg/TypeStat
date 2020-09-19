import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { isNotUndefined } from "../../shared/arrays";

import { extractRawCodefixUnionTypes } from "./extractRawCodefixUnionTypes";

/**
 * Applies types settings such as aliases and onlyPrimitives to code fix actions.
 */
export const processCodeFixActions = (
    request: FileMutationsRequest,
    codeFixActions: ReadonlyArray<ts.CodeFixAction>,
): ReadonlyArray<ts.CodeFixAction> => {
    if (request.options.types.aliases.size === 0 && request.options.types.matching === undefined && !request.options.types.onlyPrimitives) {
        return codeFixActions;
    }

    const processCodeFixAction = (codeFixes: ts.CodeFixAction): ts.CodeFixAction | undefined => {
        const changes = codeFixes.changes.map(processFileTextChanges).filter(isNotUndefined);

        return changes.length === 0
            ? undefined
            : {
                  ...codeFixes,
                  changes,
              };
    };

    const processFileTextChanges = (fileTextChanges: ts.FileTextChanges): ts.FileTextChanges | undefined => {
        const textChanges = fileTextChanges.textChanges.map(processTextChange).filter(isNotUndefined);

        return textChanges.length === 0
            ? undefined
            : {
                  ...fileTextChanges,
                  textChanges,
              };
    };

    const processTextChange = (textChange: ts.TextChange): ts.TextChange | undefined => {
        // Triva text changes, such as "(" and ")", don't need to be checked for codefixes
        if (!/[a-z0-9]/i.test(textChange.newText)) {
            return textChange;
        }

        const processedUnionTypes = extractRawCodefixUnionTypes(request, textChange.newText);
        if (processedUnionTypes === undefined || processedUnionTypes.length === 0) {
            return undefined;
        }

        return {
            ...textChange,
            newText: `: ${processedUnionTypes}`,
        };
    };

    return codeFixActions.map(processCodeFixAction).filter(isNotUndefined);
};
