import * as ts from "typescript";

export const getPropNodeFromReference = (reference: ts.Expression): ts.Expression => {
    // Case: class-style (e.g. 'this.props.key') or object style 'props.key'
    return ts.isPropertyAccessExpression(reference.parent) ? reference.parent : reference;
};
