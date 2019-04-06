import * as ts from "typescript";

import { createPropTypesProperty } from "./propTypesProperties";

export const createInterfaceFromPropTypes = (node: ts.ClassDeclaration, propTypes: ts.ObjectLiteralExpression) => {
    const members: ts.TypeElement[] = [];

    for (const rawProperty of propTypes.properties) {
        const member = createPropTypesProperty(rawProperty);
        if (member !== undefined) {
            members.push(member);
        }
    }

    return ts.createInterfaceDeclaration(
        undefined /* decorators */,
        undefined /* modifiers */,
        // Todo: allow preference for name templating
        node.name === undefined ? "AnonymousClassProps" : `${node.name.text}Props`,
        undefined /* typeParameters */,
        undefined /* heritageClauses */,
        members,
    );
};
