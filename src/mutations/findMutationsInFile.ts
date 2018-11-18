import { IMutation } from "automutate";
import * as ts from "typescript";

import { LanguageServices } from "../language";
import { TypeUpOptions } from "../options";
import { findPropertyStrictnessMutations } from "./finders/findPropertyStrictnessMutations";
import { findReturnStrictnessMutations } from "./finders/findReturnStrictnessMutations";
import { findVariableStrictnessMutations } from "./finders/findVariableStrictnessMutations";

export interface FileMutationsRequest {
    readonly options: TypeUpOptions;
    readonly services: LanguageServices;
    readonly sourceFile: ts.SourceFile;
}

/**
 * Request options for a fixer on a file.
 */
export interface FileFixerMutationsRequest extends FileMutationsRequest {
    /**
     * Comment to add
     */
    readonly comment: false | string;
}

/**
 * Collects all mutations that should apply to a file.
 */
export const findMutationsInFile = async (request: FileMutationsRequest): Promise<ReadonlyArray<IMutation>> => {
    const { fixes } = request.options;
    const mutations: IMutation[] = [];

    if (fixes.propertyStrictness !== false) {
        mutations.push(
            ...findPropertyStrictnessMutations({
                ...request,
                comment: fixes.propertyStrictness.comment,
            }),
        );
    }

    if (fixes.returnStrictness !== false) {
        mutations.push(
            ...findReturnStrictnessMutations({
                ...request,
                comment: fixes.returnStrictness.comment,
            }),
        );
    }

    if (fixes.variableStrictness !== false) {
        mutations.push(
            ...findVariableStrictnessMutations({
                ...request,
                comment: fixes.variableStrictness.comment,
            }),
        );
    }

    return mutations;
};
