import * as ts from "typescript";

import { getPropTypesMember } from "./propTypesExtraction";
import { createPropTypesTransform } from "./propTypesTransforms";

/**
 * Creates a type signature node for a raw PropTypes object literal property.
 */
export const createPropTypesProperty = (rawProperty: ts.ObjectLiteralElementLike) => {
    if (!ts.isPropertyAssignment(rawProperty) || !ts.isIdentifier(rawProperty.name)) {
        return undefined;
    }

    const propTypesMembers = getPropTypesMember(rawProperty.initializer);
    if (propTypesMembers === undefined) {
        return undefined;
    }

    const memberTypeNode = createPropTypesTransform(propTypesMembers);
    if (memberTypeNode === undefined) {
        return undefined;
    }

    return ts.factory.createPropertySignature(
        undefined /* modifiers */,
        ts.factory.createIdentifier(rawProperty.name.text),
        propTypesMembers.isRequired === undefined ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        memberTypeNode,
    );
};
