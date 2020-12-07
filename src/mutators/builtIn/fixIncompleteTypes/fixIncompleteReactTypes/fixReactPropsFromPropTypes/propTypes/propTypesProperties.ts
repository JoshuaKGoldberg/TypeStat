import * as ts from "typescript";
import { ReactPropTypesOptionality } from "../../../../../../options/enums";
import { FileMutationsRequest } from "../../../../../fileMutator";

import { getPropTypesMember } from "./propTypesExtraction";
import { createPropTypesTransform } from "./propTypesTransforms";

/**
 * Creates a type signature node for a raw PropTypes object literal property.
 */
export const createPropTypesProperty = (request: FileMutationsRequest, rawProperty: ts.ObjectLiteralElementLike) => {
    if (!ts.isPropertyAssignment(rawProperty) || !ts.isIdentifier(rawProperty.name)) {
        return undefined;
    }

    const propTypesMembers = getPropTypesMember(rawProperty.initializer);
    if (propTypesMembers === undefined) {
        return undefined;
    }

    const memberTypeNode = createPropTypesTransform(request, propTypesMembers);
    if (memberTypeNode === undefined) {
        return undefined;
    }

    return ts.factory.createPropertySignature(
        undefined /* modifiers */,
        ts.factory.createIdentifier(rawProperty.name.text),
        getQuestionToken(!!propTypesMembers.isRequired, request.options.hints.react.propTypesOptionality),
        memberTypeNode,
    );
};

const getQuestionToken = (isRequired: boolean, optionality: ReactPropTypesOptionality) => {
    return optionality === ReactPropTypesOptionality.AlwaysOptional || (!isRequired && optionality === ReactPropTypesOptionality.AsWritten)
        ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
        : undefined;
};
