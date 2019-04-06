import * as ts from "typescript";

import { PropTypesMembers } from "./propTypesExtraction";

export const createPropTypesMemberTypeNode = ({
    accessNode,
    nameNode,
}: Exclude<PropTypesMembers, "isRequired">): ts.TypeNode | undefined => {
    switch (nameNode.text) {
        case "array":
            return ts.createArrayTypeNode(ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));

        case "bool":
            return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);

        case "func":
            return ts.createTypeReferenceNode(ts.createIdentifier("Function"), undefined);

        case "element":
            // Todo: how to auto-import React just for its types?
            // Todo: is this the right type name?
            return ts.createTypeReferenceNode(ts.createIdentifier("ReactElement"), undefined);

        case "instanceOf":
            if (!ts.isCallExpression(accessNode.parent) || accessNode.parent.arguments.length !== 1) {
                return undefined;
            }

            const className = accessNode.parent.arguments[0];
            if (!ts.isIdentifier(className)) {
                return undefined;
            }

            return ts.createTypeReferenceNode(ts.createIdentifier(className.text), undefined);

        case "number":
            return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);

        case "node":
            // Todo: how to auto-import React just for its types?
            return ts.createTypeReferenceNode(ts.createIdentifier("ReactNode"), undefined);

        case "object":
            return ts.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword);

        case "string":
            return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

        case "symbol":
            return ts.createKeywordTypeNode(ts.SyntaxKind.SymbolKeyword);
    }

    // Todo: arrayOf
    // Todo: oneOf
    // Todo: oneOfType
    // Todo: shape
    return undefined;
};
