import * as ts from "typescript";

import { ReactComponentNode } from "../../reactFiltering/isReactComponentNode";

import { createPropTypesProperty } from "./propTypesProperties";

export const createInterfaceFromPropTypes = (node: ReactComponentNode, propTypes: ts.ObjectLiteralExpression) => {
    const members: ts.TypeElement[] = [];

    for (const rawProperty of propTypes.properties) {
        const member = createPropTypesProperty(rawProperty);
        if (member !== undefined) {
            members.push(member);
        }
    }

    const apparentName = getApparentNameOfComponent(node);

    // Todo: allow preference for name templating
    const interfaceName = apparentName === undefined ? "AnonymousClassProps" : `${apparentName}Props`;

    const interfaceNode = ts.createInterfaceDeclaration(
        undefined /* decorators */,
        undefined /* modifiers */,
        interfaceName,
        undefined /* typeParameters */,
        undefined /* heritageClauses */,
        members,
    );

    return { interfaceName, interfaceNode };
};

const getApparentNameOfComponent = (node: ReactComponentNode): string | undefined => {
    if (node.name !== undefined) {
        return node.name.text;
    }

    return undefined;
};
