import * as ts from "typescript";

import { FileMutationsRequest } from "../../../../../fileMutator";
import { getApparentNameOfComponent } from "../../getApparentNameOfComponent";
import { ReactComponentNode } from "../../reactFiltering/isReactComponentNode";

import { createPropTypesProperty } from "./propTypesProperties";

export const createInterfaceFromPropTypes = (
    request: FileMutationsRequest,
    node: ReactComponentNode,
    propTypes: ts.ObjectLiteralExpression,
) => {
    const members: ts.TypeElement[] = [];

    for (const rawProperty of propTypes.properties) {
        const member = createPropTypesProperty(request, rawProperty);
        if (member !== undefined) {
            members.push(member);
        }
    }

    const interfaceName = `${getApparentNameOfComponent(request, node)}Props`;

    const interfaceNode = ts.factory.createInterfaceDeclaration(
        undefined /* decorators */,
        undefined /* modifiers */,
        interfaceName,
        undefined /* typeParameters */,
        undefined /* heritageClauses */,
        members,
    );

    return { interfaceName, interfaceNode };
};
