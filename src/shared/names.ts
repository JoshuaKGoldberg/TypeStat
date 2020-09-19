import * as ts from "typescript";

/**
 * Gets the name of a property if it's statically computable from text.
 */
export const getStaticNameOfProperty = (propertyName: ts.PropertyName | undefined) => {
    if (propertyName === undefined) {
        return undefined;
    }

    if (ts.isIdentifier(propertyName) || ts.isStringLiteral(propertyName) || ts.isNumericLiteral(propertyName)) {
        return propertyName.text;
    }

    return undefined;
};
