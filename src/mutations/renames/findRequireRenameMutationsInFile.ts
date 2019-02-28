import { IMutation } from "automutate";
import * as ts from "typescript";

import { TypeStatOptions } from "../../options/types";
import { LanguageServices } from "../../services/language";

import { createRequireMutation } from "./createRequireMutation";
import { isRequireToJsFile } from "./isRequireToJsFile";

export interface RequireRenameRequest {
    allFileNames: ReadonlySet<string>;
    options: TypeStatOptions;
    services: LanguageServices;
    sourceFile: ts.SourceFile;
}

export const findRequireRenameMutationsInFile = (request: RequireRenameRequest) => {
    const mutations: IMutation[] = [];
    const visitNode = (node: ts.Node) => {
        if (isRequireToJsFile(node)) {
            const mutation = createRequireMutation(request, node);

            if (mutation !== undefined) {
                mutations.push(mutation);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    visitNode(request.sourceFile);

    return mutations;
};
