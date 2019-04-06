import * as ts from "typescript";

import { getPropTypesMember } from "./propTypesExtraction";
import { createPropTypesMemberTypeNode } from "./propTypesTransforms";

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

const createPropTypesProperty = (rawProperty: ts.ObjectLiteralElementLike) => {
    if (!ts.isPropertyAssignment(rawProperty) || !ts.isIdentifier(rawProperty.name)) {
        return undefined;
    }

    const propTypesMembers = getPropTypesMember(rawProperty.initializer);
    if (propTypesMembers === undefined) {
        return undefined;
    }

    const memberTypeNode = createPropTypesMemberTypeNode(propTypesMembers);
    if (memberTypeNode === undefined) {
        return undefined;
    }

    return ts.createPropertySignature(
        undefined /* modifiers */,
        ts.createIdentifier(rawProperty.name.text),
        propTypesMembers.isRequired === undefined ? ts.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        memberTypeNode,
        undefined /* initializer */,
    );
};
