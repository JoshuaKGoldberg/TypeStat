import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { getFriendlyFileName } from "../../../../shared/fileNames";
import { FileMutationsRequest } from "../../../../shared/fileMutator";
import { ReactComponentNode } from "./reactFiltering/isReactComponentNode";

/**
 * @returns The name of a class or function component, if determinable.
 */
export const getApparentNameOfComponent = (request: FileMutationsRequest, node: ReactComponentNode) => {
    // If the node itself has a name, great!
    if (node.name !== undefined) {
        return node.name.text;
    }

    // If the node in a single named variable declaration, use that
    if (ts.isVariableDeclaration(node.parent) && ts.isIdentifier(node.parent.name)) {
        return node.parent.name.text;
    }

    // If the node is the default export of its file, use the file's name
    if (tsutils.hasModifier(node.modifiers, ts.SyntaxKind.DefaultKeyword)) {
        return getFriendlyFileName(request.sourceFile.fileName);
    }

    return "AnonymousComponent";
};
