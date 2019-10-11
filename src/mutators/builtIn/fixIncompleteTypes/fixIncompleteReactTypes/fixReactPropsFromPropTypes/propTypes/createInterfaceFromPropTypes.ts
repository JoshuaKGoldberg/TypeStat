import * as tsutils from "tsutils";
import * as ts from "typescript";

import { getFriendlyFileName } from "../../../../../../shared/fileNames";
import { FileMutationsRequest } from "../../../../../fileMutator";
import { ReactComponentNode } from "../../reactFiltering/isReactComponentNode";

import { createPropTypesProperty } from "./propTypesProperties";

export const createInterfaceFromPropTypes = (
    request: FileMutationsRequest,
    node: ReactComponentNode,
    propTypes: ts.ObjectLiteralExpression,
) => {
    const members: ts.TypeElement[] = [];

    for (const rawProperty of propTypes.properties) {
        const member = createPropTypesProperty(rawProperty);
        if (member !== undefined) {
            members.push(member);
        }
    }

    const interfaceName = `${getApparentNameOfComponent(request, node)}Props`,
        interfaceNode = ts.createInterfaceDeclaration(
            undefined /* decorators */,
            undefined /* modifiers */,
            interfaceName,
            undefined /* typeParameters */,
            undefined /* heritageClauses */,
            members,
        );

    return { interfaceName, interfaceNode };
};

export const getApparentNameOfComponent = (request: FileMutationsRequest, node: ReactComponentNode): string | undefined => {
    // If the node itself has a name, great!
    if (node.name !== undefined) {
        return node.name.text;
    }

    // If the node is the default export of its file, use the file's name
    if (tsutils.hasModifier(node.modifiers, ts.SyntaxKind.DefaultKeyword)) {
        return getFriendlyFileName(request.sourceFile.fileName);
    }

    return "AnonymousClass";
};
