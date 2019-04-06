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

    return ts.createPropertySignature(
        undefined /* modifiers */,
        ts.createIdentifier(rawProperty.name.text),
        propTypesMembers.isRequired === undefined ? ts.createToken(ts.SyntaxKind.QuestionToken) : undefined,
        memberTypeNode,
        undefined /* initializer */,
    );
};
